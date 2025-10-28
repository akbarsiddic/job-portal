"use client";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Camera, ArrowLeft, CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import { toast } from "sonner";

// Country codes data
const countryCodes = [
  { code: "+62", flag: "ID", country: "Indonesia" },
  { code: "+1", flag: "US", country: "United States" },
  { code: "+44", flag: "GB", country: "United Kingdom" },
  { code: "+65", flag: "SG", country: "Singapore" },
  { code: "+60", flag: "MY", country: "Malaysia" },
  { code: "+61", flag: "AU", country: "Australia" },
];

function formatDate(date) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export default function JobPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Camera dialog state
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [currentPose, setCurrentPose] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureCanvasRef = useRef(null);

  // Date picker state
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [month, setMonth] = useState("");
  const [dateValue, setDateValue] = useState("");

  // Add with other states at the top
  const [countdown, setCountdown] = useState(null);
  const [detecting, setDetecting] = useState(false);

  // Phone state
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  // Form state
  const [formData, setFormData] = useState({
    photoProfile: null,
    full_name: "",
    gender: "",
    domicile: "",
    phoneNumber: "",
    email: "",
    linkedin: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const poses = [
    { id: 1, instruction: "Raise your index finger" },
    { id: 2, instruction: "Raise two fingers (peace sign)" },
    { id: 3, instruction: "Raise three fingers" },
  ];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          console.error("Error fetching job:", error);
          setError(error.message);
        } else {
          console.log(data, "INI JOB");
          setJob(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchJob();
    }
  }, [id, supabase]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = async () => {
          await tf.setBackend("webgl");
          startHandDetection();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    stopHandDetection();
  };

  const handleOpenCamera = () => {
    setCameraDialogOpen(true);
    setCurrentPose(0);
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const handleCloseCamera = () => {
    stopCamera();
    setCameraDialogOpen(false);
    setCurrentPose(0);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const captureCanvas = captureCanvasRef.current;

    if (!video || !captureCanvas) return;

    // Ensure video has frames
    if (video.readyState < 2) {
      console.warn("Video not ready for capture");
      return;
    }

    // Draw current video frame
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    const ctx = captureCanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

    captureCanvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      setFormData({ ...formData, photoProfile: file });
      setPhotoPreview(URL.createObjectURL(file));
      handleCloseCamera();
    }, "image/jpeg");
  };

  const countRaisedFingers = (landmarks) => {
    const fingers = [
      [8, 6], // index
      [12, 10], // middle
      [16, 14], // ring
      [20, 18], // pinky
    ];
    let raised = 0;
    for (const [tip, base] of fingers) {
      if (landmarks[tip][1] < landmarks[base][1]) raised++;
    }
    return raised;
  };

  const isOneFinger = (lm) => countRaisedFingers(lm) === 1;
  const isTwoFingers = (lm) => countRaisedFingers(lm) === 2;
  const isThreeFingers = (lm) => countRaisedFingers(lm) === 3;

  // Draw keypoints and connections
  const drawHand = (landmarks, ctx, poseLabel) => {
    if (!landmarks || landmarks.length < 21) return;

    // Find bounding box
    const x = landmarks.map((p) => p[0]);
    const y = landmarks.map((p) => p[1]);
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    const minY = Math.min(...y);
    const maxY = Math.max(...y);

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;

    // Draw green bounding box
    ctx.strokeStyle = "#00FF88";
    ctx.lineWidth = 3;
    ctx.strokeRect(minX - 10, minY - 10, boxWidth + 20, boxHeight + 20);

    // Draw label above the box
    if (poseLabel) {
      ctx.fillStyle = "#00FF88";
      ctx.font = "18px Inter, sans-serif";
      const labelWidth = ctx.measureText(poseLabel).width + 20;
      const labelX = minX - 10;
      const labelY = minY - 25;

      // Label background
      ctx.fillRect(labelX, labelY - 22, labelWidth, 24);

      // Label text
      ctx.fillStyle = "#000";
      ctx.fillText(poseLabel, labelX + 10, labelY - 5);
    }
  };

  // Draw label text
  const drawLabel = (ctx, text) => {
    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText(text, 20, 30);
  };

  let detectionLoop;
  const startHandDetection = async () => {
    const model = await handpose.load();
    setDetecting(true);

    const ctx = canvasRef.current?.getContext("2d");

    const detect = async () => {
      if (!videoRef.current || !ctx) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      const predictions = await model.estimateHands(videoRef.current);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (predictions.length > 0) {
        const hand = predictions[0];
        const landmarks = hand.landmarks;

        // Decide which pose it is (1, 2, 3)
        let poseLabel = null;
        if (isOneFinger(landmarks)) poseLabel = "Pose 1";
        else if (isTwoFingers(landmarks)) poseLabel = "Pose 2";
        else if (isThreeFingers(landmarks)) poseLabel = "Pose 3";

        // Draw styled bounding box
        drawHand(landmarks, ctx, poseLabel);

        if (poseLabel === "Pose 3" && countdown === null) startCountdown();
      }

      animationId = requestAnimationFrame(detect);
    };

    detect();
  };

  let animationId;
  const stopHandDetection = () => {
    cancelAnimationFrame(animationId);
    setDetecting(false);
  };
  const startCountdown = () => {
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        stopHandDetection(); // Pause the detection
        setTimeout(() => {
          capturePhoto();
        }, 100); // small delay to ensure frame is drawn
      }
    }, 1000);
  };

  const handleNextPose = () => {
    if (currentPose < poses.length - 1) {
      setCurrentPose(currentPose + 1);
    } else {
      // Final pose completed, capture photo
      capturePhoto();
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photoProfile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fullPhoneNumber = selectedCountry.code + formData.phoneNumber;

    const submissionData = {
      full_name: formData.full_name,
      gender: formData.gender,
      domicile: formData.domicile,
      phone_number: fullPhoneNumber,
      email: formData.email,
      linkedin: formData.linkedin,
      dob: dateOfBirth ? dateOfBirth.toISOString() : null,
      job_id: job.id,
    };

    console.log("Form submitted:", submissionData);

    const { data, error } = await supabase
      .from("job_applications")
      .insert(submissionData);

    if (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
      setSubmitting(false);
    } else {
      console.log("Application submitted successfully!");
      toast.success("Application submitted successfully!");
      setSubmitting(false);
      router.push("/job-portal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">No job found</div>
      </div>
    );
  }

  const fields = job.fields || {};
  const isRequired = (field) => fields[field] === "Mandatory";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center text-gray-700 hover:text-gray-900 p-0 hover:bg-transparent"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-semibold">
                  Apply {job.job_name} at Rakamin
                </span>
              </Button>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                This field required to fill
              </div>
            </div>

            <div className="text-red-600 text-sm mb-6">* Required</div>

            <form onSubmit={handleSubmit}>
              {/* Photo Profile */}
              {isRequired("photoProfile") && (
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">
                    Photo Profile<span className="text-red-600">*</span>
                  </Label>
                  <div className="flex flex-col items-start">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-start justify-start overflow-hidden mb-3">
                      {photoPreview ? (
                        <Image
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          width={128}
                          height={128}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src="/Avatar.svg"
                            alt="Avatar"
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-full"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      type="button"
                      className="flex items-center"
                      onClick={handleOpenCamera}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      <span className="text-sm">Take a Picture</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Full Name */}
              {isRequired("fullName") && (
                <div className="mb-6">
                  <Label
                    htmlFor="full_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full name<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              {/* Date of Birth */}
              {isRequired("dateOfBirth") && (
                <div className="mb-6">
                  <Label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium mb-2"
                  >
                    Date of birth<span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="dateOfBirth"
                      value={dateValue}
                      placeholder="Select date of birth"
                      className="bg-background pr-10"
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setDateValue(e.target.value);
                        if (isValidDate(date)) {
                          setDateOfBirth(date);
                          setMonth(date);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setOpenDatePicker(true);
                        }
                      }}
                      required
                    />
                    <Popover
                      open={openDatePicker}
                      onOpenChange={setOpenDatePicker}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-3.5" />
                          <span className="sr-only">Select date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          captionLayout="dropdown"
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={(date) => {
                            setDateOfBirth(date);
                            setDateValue(formatDate(date));
                            setOpenDatePicker(false);
                          }}
                          fromYear={1950}
                          toYear={2010}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              {/* Pronoun (Gender) */}
              {isRequired("gender") && (
                <div className="mb-6">
                  <Label className="block text-sm font-medium mb-2">
                    Pronoun (gender)<span className="text-red-600">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                    className="flex gap-6"
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label
                        htmlFor="female"
                        className="font-normal cursor-pointer"
                      >
                        She/her (Female)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label
                        htmlFor="male"
                        className="font-normal cursor-pointer"
                      >
                        He/him (Male)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Domicile */}
              {isRequired("domicile") && (
                <div className="mb-6">
                  <Label
                    htmlFor="domicile"
                    className="block text-sm font-medium mb-2"
                  >
                    Domicile<span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={formData.domicile}
                    onValueChange={(value) =>
                      setFormData({ ...formData, domicile: value })
                    }
                    required
                  >
                    <SelectTrigger id="domicile" className="w-full">
                      <SelectValue placeholder="Choose your domicile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jakarta">Jakarta</SelectItem>
                      <SelectItem value="Bandung">Bandung</SelectItem>
                      <SelectItem value="Surabaya">Surabaya</SelectItem>
                      <SelectItem value="Depok">Depok</SelectItem>
                      <SelectItem value="Tangerang">Tangerang</SelectItem>
                      <SelectItem value="Bekasi">Bekasi</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Phone Number */}
              {isRequired("phoneNumber") && (
                <div className="mb-6">
                  <Label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone number<span className="text-red-600">*</span>
                  </Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <InputGroupButton type="button" variant="outline">
                            <Image
                              src={`https://flagsapi.com/${selectedCountry.flag}/flat/64.png`}
                              alt={selectedCountry.flag}
                              className="w-6 h-6 rounded-full object-cover"
                              loading="lazy"
                              width={64}
                              height={64}
                            />
                          </InputGroupButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64">
                          {countryCodes.map((country) => (
                            <DropdownMenuItem
                              key={country.code}
                              onClick={() => setSelectedCountry(country)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <Image
                                src={`https://flagsapi.com/${country.flag}/flat/64.png`}
                                alt={country.flag}
                                className="w-6 h-6 rounded-full object-cover"
                                loading="lazy"
                                width={64}
                                height={64}
                              />
                              <span className="flex-1">{country.country}</span>
                              <span className="text-sm text-muted-foreground">
                                {country.code}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-start">
                      <span className="text-sm text-muted-foreground px-2">
                        {selectedCountry.code}
                      </span>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="81XXXXXXXXX"
                      required
                    />
                  </InputGroup>
                </div>
              )}

              {/* Email */}
              {isRequired("email") && (
                <div className="mb-6">
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              )}

              {/* LinkedIn Link */}
              {isRequired("linkedinLink") && (
                <div className="mb-6">
                  <Label
                    htmlFor="linkedin"
                    className="block text-sm font-medium mb-2"
                  >
                    Link Linkedin<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="linkedin"
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Camera Dialog */}
      <Dialog open={cameraDialogOpen} onOpenChange={handleCloseCamera}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Raise Your Hand to Capture
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              We'll take the photo once your hand pose is detected.
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Camera View */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-6xl font-bold">
                    {countdown}
                  </span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                To take a picture, follow the hand poses in the order shown
                below. The system will automatically capture the image once the
                final pose is detected.
              </p>

              {/* Pose Indicators */}
              <div className="flex items-center justify-center gap-4">
                {poses.map((pose, index) => (
                  <div key={pose.id} className="flex items-center">
                    <div
                      className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                        index === currentPose
                          ? "border-teal-600 bg-teal-50"
                          : index < currentPose
                            ? "border-green-600 bg-green-50"
                            : "border-gray-300"
                      }`}
                    >
                      <div className="text-4xl mb-2">
                        {pose.id === 1 && "☝️"}
                        {pose.id === 2 && "✌️"}
                        {pose.id === 3 && "🤟"}
                      </div>
                      <span className="text-xs text-gray-600">
                        Pose {pose.id}
                      </span>
                    </div>
                    {index < poses.length - 1 && (
                      <div className="text-gray-400 mx-2">→</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Current Instruction */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  {poses[currentPose].instruction}
                </p>
              </div>

              {/* Manual Next Button (for testing) */}
              <Button
                onClick={handleNextPose}
                className="mt-4 bg-teal-600 hover:bg-teal-700"
              >
                {currentPose < poses.length - 1
                  ? "Next Pose (Manual)"
                  : "Capture Photo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <canvas ref={captureCanvasRef} className="hidden" />
    </div>
  );
}
