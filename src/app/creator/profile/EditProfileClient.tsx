"use client";

import { useState } from "react";

type Profile = {
  displayName: string;
  bio: string;
  location: string;
  niche: string;
  platforms: string;
  profileImage: string;
};

export default function EditProfileClient({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const [form, setForm] = useState(initialProfile);
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);

    await fetch("/api/creator/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-medium">Edit Profile</h1>

      {/* Profile Image */}
      <div className="space-y-3">
        <label className="text-sm opacity-70">Profile Picture</label>

        <div className="flex items-center gap-4">
          {form.profileImage ? (
            <img
              src={form.profileImage}
              alt={form.displayName}
              className="h-20 w-20 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-[#636EE1]/20 flex items-center justify-center text-xl font-medium">
              {form.displayName?.[0]?.toUpperCase() ?? "C"}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

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
            }}
            className="text-xs"
          />
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <label className="text-sm opacity-70">Display Name</label>
        <input
          value={form.displayName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, displayName: e.target.value }))
          }
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-sm opacity-70">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, bio: e.target.value }))
          }
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm opacity-70">Location</label>
        <input
          value={form.location}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, location: e.target.value }))
          }
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Niche */}
      <div className="space-y-2">
        <label className="text-sm opacity-70">Primary Niche</label>
        <input
          value={form.niche}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, niche: e.target.value }))
          }
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Platforms */}
      <div className="space-y-2">
        <label className="text-sm opacity-70">Platforms</label>
        <input
          value={form.platforms}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, platforms: e.target.value }))
          }
          placeholder="Instagram, YouTube, LinkedIn"
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Save */}
      <button
        onClick={saveProfile}
        disabled={saving}
        className="rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
