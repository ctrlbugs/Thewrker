"use client";

import { useState } from "react";
import { Bell, Lock, Globe, Mail, Shield, Save } from "lucide-react";

export default function TalentSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobMatches: true,
    applicationUpdates: true,
    marketingEmails: false,
    twoFactorAuth: false,
    publicProfile: true,
    language: "en",
  });

  const handleSave = () => {
    // In production, save to API
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-brand-secondary" />
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email updates about your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Job Matches</p>
              <p className="text-sm text-gray-600">Get notified when new jobs match your profile</p>
            </div>
            <input
              type="checkbox"
              checked={settings.jobMatches}
              onChange={(e) => setSettings({ ...settings, jobMatches: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Application Updates</p>
              <p className="text-sm text-gray-600">Updates on your job applications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.applicationUpdates}
              onChange={(e) => setSettings({ ...settings, applicationUpdates: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Marketing Emails</p>
              <p className="text-sm text-gray-600">Receive tips, updates, and promotional content</p>
            </div>
            <input
              type="checkbox"
              checked={settings.marketingEmails}
              onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
            />
          </label>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-brand-secondary" />
          <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Public Profile</p>
              <p className="text-sm text-gray-600">Allow recruiters to view your profile</p>
            </div>
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={(e) => setSettings({ ...settings, publicProfile: e.target.checked })}
              className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
            />
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
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
