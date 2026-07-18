"use client";

import { useState } from "react";
import { Save, Bell, Shield, Globe } from "lucide-react";

export default function TraineeSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    marketingEmails: false,
    language: "en",
  });

  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-brand-secondary" />
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email updates about your progress</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Course Updates</p>
              <p className="text-sm text-gray-600">Get notified when new content is available</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) => setSettings({ ...settings, emailUpdates: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded"
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-6 w-6 text-brand-secondary" />
          <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary text-gray-900 bg-gray-50 focus:bg-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition font-semibold flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
