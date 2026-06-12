"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_CAREEROS_STATE,
  loadCareerOSState,
  saveCareerOSState,
} from "@/lib/careeros/storage";
import type {
  CareerGrowthPlan,
  CareerOSState,
  CareerProfile,
  JobApplication,
  CareerReminder,
} from "@/lib/careeros/types";
import { inferCareerLevel } from "@/lib/careeros/analysis";
import { buildCareerDNA } from "@/lib/careeros/career-dna";

export function useCareerOS() {
  const [state, setState] = useState<CareerOSState>(DEFAULT_CAREEROS_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadCareerOSState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveCareerOSState(state);
  }, [state, ready]);

  const updateProfile = useCallback((patch: Partial<CareerProfile>) => {
    setState((current) => {
      const profile = { ...current.profile, ...patch };
      profile.level = inferCareerLevel(profile);
      if (profile.resumeText.trim()) {
        profile.careerDNA = buildCareerDNA(profile);
      }
      return { ...current, profile };
    });
  }, []);

  const upsertApplication = useCallback((application: JobApplication) => {
    setState((current) => {
      const exists = current.applications.some((item) => item.id === application.id);
      const applications = exists
        ? current.applications.map((item) => (item.id === application.id ? application : item))
        : [application, ...current.applications];
      return { ...current, applications };
    });
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      applications: current.applications.filter((item) => item.id !== id),
      reminders: current.reminders.filter((item) => item.applicationId !== id),
    }));
  }, []);

  const upsertReminder = useCallback((reminder: CareerReminder) => {
    setState((current) => {
      const exists = current.reminders.some((item) => item.id === reminder.id);
      const reminders = exists
        ? current.reminders.map((item) => (item.id === reminder.id ? reminder : item))
        : [reminder, ...current.reminders];
      return { ...current, reminders };
    });
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      reminders: current.reminders.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    }));
  }, []);

  const setGrowthPlan = useCallback((plan: CareerGrowthPlan | null) => {
    setState((current) => ({ ...current, growthPlan: plan }));
  }, []);

  const toggleGrowthMilestone = useCallback((index: number) => {
    setState((current) => {
      if (!current.growthPlan) return current;
      const milestones = current.growthPlan.milestones.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item,
      );
      return {
        ...current,
        growthPlan: { ...current.growthPlan, milestones },
      };
    });
  }, []);

  return {
    state,
    ready,
    updateProfile,
    upsertApplication,
    deleteApplication,
    upsertReminder,
    toggleReminder,
    setGrowthPlan,
    toggleGrowthMilestone,
  };
}
