"use client";

import { useState, useEffect, useRef } from "react";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { XIcon, PlusIcon, UploadIcon } from "lucide-react";

// For type-safe access to technologies_used
const TECH_CATEGORIES = [
  "languages",
  "frontend",
  "backend",
  "database",
  "apis_tools",
] as const;
type TechCategory = (typeof TECH_CATEGORIES)[number];

interface ProjectFormProps {
  project?: Project;
  onSubmit: (projectData: Omit<Project, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) {
  // Skills for autocomplete
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [techSuggestions, setTechSuggestions] = useState<
    Record<TechCategory, string[]>
  >({
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    apis_tools: [],
  });
  const [techInput, setTechInput] = useState<Record<TechCategory, string>>({
    languages: "",
    frontend: "",
    backend: "",
    database: "",
    apis_tools: "",
  });

  // Fetch all skills for suggestions
  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((skills) => {
        if (Array.isArray(skills)) {
          setAllSkills(skills.map((s: any) => s.name));
        }
      });
  }, []);
  const [formData, setFormData] = useState({
    // Basic info
    title: "",
    description: "",
    image_url: "",
    github_url: "",
    live_url: "",
    featured: false,
    status: "completed" as "completed" | "ongoing",
    type: "individual" as "individual" | "group",
    // Detailed info
    project_type_detail: "",
    role: "",
    duration: "",
    technologies_used: {
      languages: [] as string[],
      frontend: [] as string[],
      backend: [] as string[],
      database: [] as string[],
      apis_tools: [] as string[],
    },
    key_features: [] as string[],
    my_contributions: [] as string[],
  });

  // Duration fields
  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const currentYear = new Date().getFullYear();
  // Show most recent year at the top
  const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);
  
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Additional images state
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      const newFormData = {
        title: project.title || "",
        description: project.description || "",
        image_url: project.image_url || "",
        github_url: project.github_url || "",
        live_url: project.live_url || "",
        featured: project.featured || false,
        status: project.status || "completed",
        type: project.type || "individual",
        project_type_detail: project.project_type_detail || "",
        role: project.role || "",
        duration: project.duration || "",
        technologies_used: {
          languages: project.technologies_used?.languages || [],
          frontend: project.technologies_used?.frontend || [],
          backend: project.technologies_used?.backend || [],
          database: project.technologies_used?.database || [],
          apis_tools: project.technologies_used?.apis_tools || [],
        },
        key_features: project.key_features || [],
        my_contributions: project.my_contributions || [],
      };
      setFormData(newFormData);
      // Initialize techInput with existing project data
      const newTechInput = {
        languages: newFormData.technologies_used.languages.join(", "),
        frontend: newFormData.technologies_used.frontend.join(", "),
        backend: newFormData.technologies_used.backend.join(", "),
        database: newFormData.technologies_used.database.join(", "),
        apis_tools: newFormData.technologies_used.apis_tools.join(", "),
      };
      setTechInput(newTechInput);

      // Synchronize ongoing checkbox with project status
      setIsOngoing(project.status === "ongoing");

      // Set image preview if editing existing project
      if (project.image_url) {
        setImagePreview(project.image_url);
      } else {
        setImagePreview("");
      }
      // Set additional images if editing existing project
      if (project.additional_images && Array.isArray(project.additional_images)) {
        setAdditionalImagePreviews(project.additional_images);
      } else {
        setAdditionalImagePreviews([]);
      }
      setAdditionalImages([]); // always reset files
      // Parse duration for edit mode
      if (project.duration) {
        // e.g., "Mar 2024 - Jul 2025" or "Mar 2024 - Ongoing"
        const durationStr = project.duration.trim();

        // More robust regex to handle various formats
        const match = durationStr.match(/^(\w+)\s+(\d{4})\s*-\s*(.+)$/);
        if (match) {
          const startMonth = match[1];
          const startYear = match[2];
          const endPart = match[3].trim();

          setStartMonth(startMonth);
          setStartYear(startYear);

          if (endPart.toLowerCase() === "ongoing") {
            setIsOngoing(true);
            setEndMonth("");
            setEndYear("");
            setFormData((prev) => ({ ...prev, status: "ongoing" }));
          } else {
            // Try to parse end date (e.g., "Jul 2025" or "Jul 2025")
            const endMatch = endPart.match(/^(\w+)\s+(\d{4})$/);
            if (endMatch) {
              setIsOngoing(false);
              setEndMonth(endMatch[1]);
              setEndYear(endMatch[2]);
              setFormData((prev) => ({ ...prev, status: "completed" }));
            } else {
              // Fallback: treat as completed but couldn't parse end date
              setIsOngoing(false);
              setEndMonth("");
              setEndYear("");
              setFormData((prev) => ({ ...prev, status: "completed" }));
            }
          }
        } else {
          // If parsing fails, reset to empty state
          setStartMonth("");
          setStartYear("");
          setEndMonth("");
          setEndYear("");
          setIsOngoing(false);
          setFormData((prev) => ({ ...prev, status: "completed" }));
        }
      }
    } else {
      // Reset form when no project (adding new project)
      setFormData({
        title: "",
        description: "",
        image_url: "",
        github_url: "",
        live_url: "",
        featured: false,
        status: "completed",
        type: "individual",
        project_type_detail: "",
        role: "",
        duration: "",
        technologies_used: {
          languages: [],
          frontend: [],
          backend: [],
          database: [],
          apis_tools: [],
        },
        key_features: [],
        my_contributions: [],
      });
      setTechInput({
        languages: "",
        frontend: "",
        backend: "",
        database: "",
        apis_tools: "",
      });
      setImagePreview("");
      setAdditionalImagePreviews([]);
      setAdditionalImages([]);
      setStartMonth("");
      setStartYear("");
      setEndMonth("");
      setEndYear("");
      setIsOngoing(false);
      // Reset form status for new projects
      setFormData((prev) => ({ ...prev, status: "completed" }));
    }
  }, [project]);

  // Handle additional images selection
  const handleAdditionalImagesSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    // Validate and filter files
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const filtered = files.filter(
      (file) => validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
    );
    if (filtered.length < files.length) {
      alert("Some files were not valid images or exceeded 5MB.");
    }
    setAdditionalImages((prev) => [...prev, ...filtered]);
    // Generate previews
    filtered.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAdditionalImagePreviews((prev) => [
          ...prev,
          ev.target?.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (additionalFileInputRef.current)
      additionalFileInputRef.current.value = "";
  };

  // Remove additional image (by index)
  const removeAdditionalImage = (idx: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPG, PNG, WebP, GIF)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("fileName", selectedImage.name);

      const response = await fetch("/api/upload/project-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Compose duration string and status
    let duration = "";
    let status: "completed" | "ongoing" = "completed";
    if (startMonth && startYear) {
      duration = `${startMonth} ${startYear} - `;
      if (isOngoing) {
        duration += "Ongoing";
        status = "ongoing";
      } else if (endMonth && endYear) {
        duration += `${endMonth} ${endYear}`;
        status = "completed";
      }
    }

    let imageUrl = formData.image_url;
    let additionalImageUrls: string[] = additionalImagePreviews.filter((url) =>
      url.startsWith("http")
    );

    // Upload main image and additional images in parallel for better performance
    const uploadPromises = [];

    // Upload main image if selected
    if (selectedImage) {
      uploadPromises.push(
        uploadImage().then(url => {
          if (url) {
            imageUrl = url;
          } else {
            throw new Error("Main image upload failed");
          }
        })
      );
    }

    // Upload additional images if any
    if (additionalImages.length > 0) {
      uploadPromises.push(
        (async () => {
          try {
            const batchFormData = new FormData();

            // Add all files and their names to the form data
            additionalImages.forEach((file, index) => {
              batchFormData.append('files', file);
              batchFormData.append('fileNames', file.name);
            });

            const response = await fetch("/api/upload/project-images", {
              method: "POST",
              body: batchFormData,
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.errors && result.errors.length > 0) {
              console.error('Some uploads failed:', result.errors);
              const errorMessage = `Some images failed to upload:\n${result.errors.map((error: string, index: number) => `${index + 1}. ${error}`).join('\n')}\n\nSuccessfully uploaded ${result.urls?.length || 0} of ${additionalImages.length} images.`;
              alert(errorMessage);
              // Still add successfully uploaded images
              if (result.urls && result.urls.length > 0) {
                additionalImageUrls.push(...result.urls);
              }
            } else {
              // All uploads successful
              additionalImageUrls.push(...result.urls);
            }
          } catch (error) {
            console.error('Error uploading additional images:', error);
            throw new Error("Additional images upload failed");
          }
        })()
      );
    }

    // Wait for all uploads to complete
    try {
      setIsUploadingImage(true);
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload error:', error);
      alert("Failed to upload images. Please try again.");
      return;
    } finally {
      setIsUploadingImage(false);
    }

    onSubmit({
      ...formData,
      duration,
      status,
      image_url: imageUrl,
      additional_images: additionalImageUrls,
    });
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {project ? "Edit Project" : "Add New Project"}
          </h2>
          <Button variant="outline" onClick={onCancel} className="p-2">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Type Detail
              </label>
              <Input
                type="text"
                value={formData.project_type_detail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    project_type_detail: e.target.value,
                  }))
                }
                placeholder="e.g., Solo Project, Team Project, Client Project"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                My Role
              </label>
              <Input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                placeholder="e.g., Full Stack Developer, Lead Developer"
              />
            </div>
            {/* Project Status dropdown removed; status is now determined by Ongoing checkbox and end date */}
          </div>
          {/* Duration Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Month & Year
              </label>
              <div className="flex gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                >
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white !overflow-y-auto !max-h-60"
                  required
                >
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Month & Year
              </label>
              <div className="flex gap-2 items-center">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  disabled={isOngoing}
                  required={!isOngoing}
                >
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white !overflow-y-auto !max-h-60"
                  disabled={isOngoing}
                  required={!isOngoing}
                >
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <label className="ml-2 flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={isOngoing}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsOngoing(checked);
                      if (checked) {
                        setEndMonth("");
                        setEndYear("");
                        setFormData((prev) => ({ ...prev, status: "ongoing" }));
                      } else {
                        // When unchecked, reset status to completed
                        setFormData((prev) => ({ ...prev, status: "completed" }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  Ongoing
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              rows={4}
              placeholder="Enter project description"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Technologies Used (detailed breakdown) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Technologies Used
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TECH_CATEGORIES.map((cat) => (
                <div key={cat}>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 capitalize">
                    {cat.replace("_", " ")}
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={techInput[cat]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTechInput((prev) => ({ ...prev, [cat]: value }));
                        // Show suggestions for last token
                        const last =
                          value.split(",").pop()?.trim().toLowerCase() || "";
                        if (last.length > 0) {
                          setTechSuggestions((prev) => ({
                            ...prev,
                            [cat]: allSkills.filter(
                              (skill) =>
                                skill.toLowerCase().includes(last) &&
                                !formData.technologies_used[cat].includes(skill)
                            ),
                          }));
                        } else {
                          setTechSuggestions((prev) => ({
                            ...prev,
                            [cat]: [],
                          }));
                        }
                        // Update formData if comma entered
                        if (value.endsWith(",")) {
                          const arr = value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          setFormData((prev) => ({
                            ...prev,
                            technologies_used: {
                              ...prev.technologies_used,
                              [cat]: arr,
                            },
                          }));
                        }
                      }}
                      onBlur={() => {
                        // On blur, update formData and clear suggestions
                        const arr = techInput[cat]
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setFormData((prev) => ({
                          ...prev,
                          technologies_used: {
                            ...prev.technologies_used,
                            [cat]: arr,
                          },
                        }));
                        setTechSuggestions((prev) => ({ ...prev, [cat]: [] }));
                      }}
                      placeholder={`Comma-separated list for ${cat}`}
                      autoComplete="off"
                    />
                    {/* Suggestions dropdown */}
                    {techSuggestions[cat].length > 0 && (
                      <ul className="absolute z-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
                        {techSuggestions[cat].map((suggestion) => (
                          <li
                            key={suggestion}
                            className="px-3 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-700"
                            onMouseDown={() => {
                              // Add suggestion to list
                              const arr = techInput[cat]
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              arr[arr.length - 1] = suggestion;
                              setFormData((prev) => ({
                                ...prev,
                                technologies_used: {
                                  ...prev.technologies_used,
                                  [cat]: Array.from(new Set([...arr])),
                                },
                              }));
                              setTechInput((prev) => ({
                                ...prev,
                                [cat]: arr.join(", ") + ", ",
                              }));
                              setTechSuggestions((prev) => ({
                                ...prev,
                                [cat]: [],
                              }));
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Key Features
            </label>
            <Input
              type="text"
              value={formData.key_features.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  key_features: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Comma-separated list of features"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              My Contributions
            </label>
            <Input
              type="text"
              value={formData.my_contributions.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  my_contributions: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Comma-separated list of your contributions"
            />
          </div>

          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Project Image
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Project preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-300"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-white dark:bg-slate-800"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* File Input */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <UploadIcon className="h-4 w-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
              {selectedImage && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedImage.name}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supported formats: JPG, PNG, WebP, GIF. Max size: 5MB
            </p>
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Additional Images
            </label>
            <div className="flex items-center gap-3 mb-2">
              <input
                ref={additionalFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => additionalFileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <UploadIcon className="h-4 w-4" />
                Add Images
              </Button>
            </div>
            {/* Previews */}
            <div className="flex flex-wrap gap-3">
              {additionalImagePreviews.map((img, idx) => (
                <div key={img + idx} className="relative">
                  <img
                    src={img}
                    alt={`Additional ${idx + 1}`}
                    className="w-28 h-20 object-cover rounded border border-slate-300"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeAdditionalImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-white dark:bg-slate-800"
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supported formats: JPG, PNG, WebP, GIF. Max size: 5MB each
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              GitHub URL
            </label>
            <Input
              type="url"
              value={formData.github_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, github_url: e.target.value }))
              }
              placeholder="Enter GitHub repository URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Live URL
            </label>
            <Input
              type="url"
              value={formData.live_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, live_url: e.target.value }))
              }
              placeholder="Enter live project URL"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="featured"
                className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
              >
                Featured Project
              </label>
            </div>
            <div className="flex items-center">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">
                Type:
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as "individual" | "group",
                  }))
                }
                className="border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploadingImage}>
              {isUploadingImage
                ? "Uploading Image..."
                : isLoading
                ? "Saving..."
                : project
                ? "Update Project"
                : "Create Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
