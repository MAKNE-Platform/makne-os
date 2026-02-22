"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";

type Profile = {
  displayName: string;
  bio: string;
  location: string;
  niche: string;
  platforms: string;
  profileImage: string;
  skills: {
    contentFormats: string[];
    tools: string[];
    languages: string[];
    strengths: string[];
  };
};

export default function EditProfileClient({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const [form, setForm] = useState<Profile>({
    ...initialProfile,
    displayName:
      initialProfile.displayName &&
        !initialProfile.displayName.includes("@")
        ? initialProfile.displayName
        : "",
  });
  const [saving, setSaving] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  console.log("Initial profile:", initialProfile);

  async function saveProfile() {
    setSaving(true);

    await fetch("/api/creator/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
  }

  const [contentFormatsInput, setContentFormatsInput] = useState(
    form.skills.contentFormats.join(", ")
  );

  const [toolsInput, setToolsInput] = useState(
    form.skills.tools.join(", ")
  );

  const [languagesInput, setLanguagesInput] = useState(
    form.skills.languages.join(", ")
  );

  const [strengthsInput, setStrengthsInput] = useState(
    form.skills.strengths.join(", ")
  );


  // Local editable string states (for smooth typing UX)
  const [skillInputs, setSkillInputs] = useState({
    contentFormats: form.skills?.contentFormats?.join(", ") || "",
    tools: form.skills?.tools?.join(", ") || "",
    languages: form.skills?.languages?.join(", ") || "",
    strengths: form.skills?.strengths?.join(", ") || "",
  });

  console.log("Current form state:", form.displayName);


  return (
    <div className="space-y-10 py-5">

      {/* ===== Header ===== */}
      <div className="space-y-4">
        <a
          href="/creator/portfolio"
          className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition"
        >
          <ArrowLeft /> Back to Portfolio
        </a>

        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Edit Profile
          </h1>
          <p className="text-sm opacity-60 mt-1">
            Update your creator profile information.
          </p>
        </div>
      </div>

      {/* ===== Profile Image Card ===== */}
      <div className="bg-[#ffffff07] border border-white/10 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-medium">Profile Picture</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6">

          <div className="relative">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt={form.displayName}
                className="h-24 w-24 rounded-full object-cover border border-white/10 shadow-md"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-[#636EE1]/20 flex items-center justify-center text-3xl font-medium border border-white/10">
                {form.displayName?.[0]?.toUpperCase() ?? "C"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setUploadingImage(true);

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload/profile-image", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();

                setForm((prev) => ({
                  ...prev,
                  profileImage: data.url,
                }));

                setUploadingImage(false);
              }}
              className="text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#636EE1] file:px-4 file:py-2 file:text-black file:text-sm file:font-medium hover:file:opacity-90"
            />

            {uploadingImage && (
              <div className="text-xs text-[#636EE1] animate-pulse">
                Uploading image...
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ===== Basic Information ===== */}
      <div className="bg-[#ffffff07] border border-white/10 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-medium">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-sm opacity-70">Display Name</label>
            <input
              value={
                form.displayName && !form.displayName.includes("@")
                  ? form.displayName
                  : ""
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#636EE1]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm opacity-70">Location</label>
            <input
              value={form.location ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#636EE1]"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm opacity-70">Bio</label>
            <textarea
              value={form.bio ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              rows={4}
              className="w-full bg-black mt-2 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#636EE1]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm opacity-70">Primary Niche</label>
            <input
              value={form.niche ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  niche: e.target.value,
                }))
              }
              placeholder="e.g. Tech, AI, Finance"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#636EE1]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm opacity-70">Platforms</label>
            <input
              value={form.platforms ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  platforms: e.target.value,
                }))
              }
              placeholder="Instagram, YouTube, LinkedIn"
              className="w-full bg-black mt-2 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#636EE1]"
            />
          </div>

        </div>
      </div>

      {/* ===== Skills ===== */}
      <div className="bg-[#ffffff07] border border-white/10 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-medium">Skills & Capabilities</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { key: "contentFormats", label: "Content Formats" },
            { key: "tools", label: "Tools & Software" },
            { key: "languages", label: "Languages" },
            { key: "strengths", label: "Strengths" },
          ].map((section) => (
            <div key={section.key} className="space-y-2">
              <label className="text-sm opacity-70">
                {section.label}
              </label>

              <input
                placeholder="Comma separated values"
                value={skillInputs[section.key as keyof typeof skillInputs]}
                onChange={(e) =>
                  setSkillInputs((prev) => ({
                    ...prev,
                    [section.key]: e.target.value,
                  }))
                }
                onBlur={() =>
                  setForm((prev) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      [section.key]: skillInputs[
                        section.key as keyof typeof skillInputs
                      ]
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    },
                  }))
                }
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#636EE1]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="rounded-lg bg-[#636EE1] px-6 py-2.5 text-sm text-white shadow-md hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

    </div>
  );
}
