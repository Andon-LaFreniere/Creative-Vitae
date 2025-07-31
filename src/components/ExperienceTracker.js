import React, { useState } from "react";
import { Calendar, Briefcase, GraduationCap, Plus, X } from "lucide-react";

const ExperienceTracker = () => {
  const [experiences, setExperiences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "work",
    startDate: "",
    endDate: "",
    current: false,
    color: "bg-blue-500",
  });

  const colors = [
    { name: "Blue", value: "bg-blue-500", preview: "bg-blue-500" },
    { name: "Red", value: "bg-red-500", preview: "bg-red-500" },
    { name: "Green", value: "bg-green-500", preview: "bg-green-500" },
    { name: "Purple", value: "bg-purple-500", preview: "bg-purple-500" },
    { name: "Yellow", value: "bg-yellow-500", preview: "bg-yellow-500" },
    { name: "Pink", value: "bg-pink-500", preview: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500", preview: "bg-indigo-500" },
    { name: "Teal", value: "bg-teal-500", preview: "bg-teal-500" },
    { name: "Orange", value: "bg-orange-500", preview: "bg-orange-500" },
    { name: "Cyan", value: "bg-cyan-500", preview: "bg-cyan-500" },
    { name: "Emerald", value: "bg-emerald-500", preview: "bg-emerald-500" },
    { name: "Violet", value: "bg-violet-500", preview: "bg-violet-500" },
  ];

  const handleSubmit = () => {
    if (!formData.title || !formData.startDate) return;

    const newExperience = {
      ...formData,
      id: Date.now(),
      color: formData.color,
      endDate: formData.current ? null : formData.endDate,
    };

    setExperiences([...experiences, newExperience]);
    setFormData({
      title: "",
      description: "",
      type: "work",
      startDate: "",
      endDate: "",
      current: false,
      color: "bg-blue-500",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Calculate timeline dimensions and positions
  const calculateTimelineData = () => {
    if (experiences.length === 0)
      return { timelineHeight: 400, experienceBlocks: [], yearMarkers: [] };

    const currentDate = new Date();

    // Get all dates and sort them
    const allDates = [];
    experiences.forEach((exp) => {
      allDates.push(new Date(exp.startDate));
      allDates.push(exp.endDate ? new Date(exp.endDate) : currentDate);
    });

    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    // Add some padding
    minDate.setFullYear(minDate.getFullYear() - 1);
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const totalTimeSpan = maxDate.getTime() - minDate.getTime();
    const timelineHeight = Math.max(600, experiences.length * 100);

    // Convert each experience to a timeline block
    const experienceBlocks = experiences.map((exp, index) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : currentDate;

      const startPosition =
        ((maxDate.getTime() - startDate.getTime()) / totalTimeSpan) *
        timelineHeight;
      const endPosition =
        ((maxDate.getTime() - endDate.getTime()) / totalTimeSpan) *
        timelineHeight;

      const height = Math.max(startPosition - endPosition, 20); // Minimum height of 20px

      return {
        ...exp,
        startPosition: endPosition,
        height: height,
        startDate: startDate,
        endDate: endDate,
      };
    });

    // Group overlapping experiences
    const groupedBlocks = [];
    experienceBlocks.forEach((block) => {
      let placed = false;

      for (let group of groupedBlocks) {
        // Check if this block overlaps with any block in the group
        const overlaps = group.some((existingBlock) => {
          const blockStart = block.startPosition;
          const blockEnd = block.startPosition + block.height;
          const existingStart = existingBlock.startPosition;
          const existingEnd =
            existingBlock.startPosition + existingBlock.height;

          return !(blockEnd < existingStart || blockStart > existingEnd);
        });

        if (overlaps) {
          group.push(block);
          placed = true;
          break;
        }
      }

      if (!placed) {
        groupedBlocks.push([block]);
      }
    });

    // Assign horizontal positions
    const finalBlocks = [];
    groupedBlocks.forEach((group) => {
      const blockWidth = Math.min(200, 600 / group.length);
      group.forEach((block, index) => {
        finalBlocks.push({
          ...block,
          left: index * (blockWidth + 10),
          width: blockWidth,
        });
      });
    });

    // Create year markers
    const yearMarkers = [];
    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();

    for (let year = startYear; year <= endYear; year++) {
      const yearDate = new Date(year, 0, 1);
      if (yearDate >= minDate && yearDate <= maxDate) {
        const position =
          ((maxDate.getTime() - yearDate.getTime()) / totalTimeSpan) *
          timelineHeight;
        yearMarkers.push({
          year,
          position,
        });
      }
    }

    return {
      timelineHeight,
      experienceBlocks: finalBlocks,
      yearMarkers,
    };
  };

  const { timelineHeight, experienceBlocks, yearMarkers } =
    calculateTimelineData();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Creative Vitae
            </h1>
            <p className="text-gray-600">
              Track your work and education journey
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Experience
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border">
            <h2 className="text-xl font-semibold mb-4">Add New Experience</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer, Bachelor's Degree"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                      className={`w-12 h-12 rounded-lg ${
                        color.preview
                      } border-2 transition-all hover:scale-105 ${
                        formData.color === color.value
                          ? "border-gray-800 ring-2 ring-gray-300"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      title={color.name}
                    >
                      {formData.color === color.value && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected:{" "}
                  {colors.find((c) => c.value === formData.color)?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description of your role and achievements"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={formData.current}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : formData.endDate,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="current"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I currently work/study here
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Add Experience
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* True Vertical Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Calendar className="text-blue-600" size={24} />
          Timeline
        </h2>

        {experiences.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No experiences added yet</p>
            <p>Click "Add Experience" to get started!</p>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <div
              className="relative mx-auto"
              style={{
                height: `${timelineHeight}px`,
                width: "800px",
                minWidth: "600px",
              }}
            >
              {/* Year markers on the left */}
              {yearMarkers.map((marker) => (
                <div
                  key={marker.year}
                  className="absolute left-0 text-gray-600 font-semibold text-lg flex items-center"
                  style={{
                    top: `${marker.position}px`,
                    transform: "translateY(-50%)",
                  }}
                >
                  {marker.year}
                  <div className="ml-2 w-4 h-0.5 bg-gray-400"></div>
                </div>
              ))}

              {/* Experience blocks */}
              {experienceBlocks.map((block) => (
                <div
                  key={block.id}
                  className={`absolute ${block.color} text-white rounded-lg shadow-lg border-2 border-white hover:shadow-xl transition-all duration-200 group cursor-pointer`}
                  style={{
                    top: `${block.startPosition}px`,
                    left: `${80 + block.left}px`,
                    width: `${block.width}px`,
                    height: `${block.height}px`,
                    minHeight: "60px",
                  }}
                >
                  <div className="p-3 h-full flex flex-col justify-between relative">
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="absolute top-1 right-1 p-1 hover:bg-white/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete experience"
                    >
                      <X size={12} />
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        {block.type === "work" ? (
                          <Briefcase size={14} />
                        ) : (
                          <GraduationCap size={14} />
                        )}
                        <h3 className="font-semibold text-sm leading-tight">
                          {block.title}
                        </h3>
                      </div>

                      {block.description && block.height > 80 && (
                        <p className="text-xs text-white/90 leading-tight line-clamp-3 mb-2">
                          {block.description}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-white/80 space-y-0.5">
                      <div>
                        {formatDate(
                          block.startDate.toISOString().split("T")[0]
                        )}
                      </div>
                      <div>
                        {block.endDate
                          ? formatDate(
                              block.endDate.toISOString().split("T")[0]
                            )
                          : "Present"}
                      </div>
                      <div className="bg-white/20 px-1 py-0.5 rounded text-xs uppercase font-medium inline-block">
                        {block.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* "Present" indicator at the top */}
              <div className="absolute top-0 left-0 right-0 text-center">
                <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                  Present
                </div>
              </div>

              {/* "Past" indicator at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 text-center">
                <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                  Past
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceTracker;
