"use client";



import { useState } from "react";

import ActionButton from "@/components/ui/ActionButton";

import OperationStatus from "@/components/ui/OperationStatus";

import { useAsyncTask } from "@/hooks/useAsyncTask";

import { useApiIntegrations } from "@/hooks/useApiIntegrations";

import { aiGenerateCoverLetter } from "@/lib/api/careeros-client";

import { generateCoverLetter } from "@/lib/careeros/analysis";

import { useCareerOSContext } from "./CareerOSProvider";



export default function CoverLetterStudioTool() {

  const task = useAsyncTask();

  const { status: apiStatus } = useApiIntegrations();

  const { state, updateProfile } = useCareerOSContext();

  const [company, setCompany] = useState("");

  const [role, setRole] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [letter, setLetter] = useState(state.profile.coverLetterText);

  const [message, setMessage] = useState("");



  const generate = async () => {

    if (!company.trim() || !role.trim()) {

      setMessage("Company and role are required.");

      return;

    }



    if (apiStatus.openai) {

      await task.run("Generating cover letter...", async (update) => {

        update(35, "Matching skills to job description...");

        const result = await aiGenerateCoverLetter({

          profileName: state.profile.name,

          headline: state.profile.headline,

          resumeText: state.profile.resumeText,

          skills: state.profile.skills,

          company,

          role,

          jobDescription,

        });

        update(100, "Done.");

        setLetter(result.letter);

        updateProfile({ coverLetterText: result.letter });

        setMessage("ATS-optimized cover letter generated. Edit and export when ready.");

      });

      return;

    }



    const result = generateCoverLetter(state.profile, company, role, jobDescription);

    setLetter(result);

    updateProfile({ coverLetterText: result });

    setMessage("Cover letter generated.");

  };



  const copy = async () => {

    if (!letter) return;

    await navigator.clipboard.writeText(letter);

    setMessage("Copied to clipboard.");

  };



  const exportLetter = () => {

    const blob = new Blob([letter], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `cover-letter-${company || "careeros"}.txt`;

    a.click();

    URL.revokeObjectURL(url);

    setMessage("Cover letter exported.");

  };



  return (

    <div className="space-y-6">

      <div className="pd-careeros-flow-hero">

        <p className="pd-careeros-kicker">Smart Cover Letter Builder</p>

        <h2 className="pd-careeros-section-title mt-1">Personalized, not generic</h2>

        <p className="pd-careeros-muted mt-2 max-w-2xl">

          Paste a job description — CareerOS matches your skills, company, and role to produce an ATS-optimized

          cover letter you can edit and export.

        </p>

      </div>



      <OperationStatus

        active={task.active}

        progress={task.progress}

        message={task.message}

        error={task.error}

      />



      {message && !task.active && <p className="body-regular-14">{message}</p>}



      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="space-y-4">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <label className="block">

              <span className="body-emphasized-14pt mb-1 block">Company</span>

              <input className="pd-input" value={company} onChange={(e) => setCompany(e.target.value)} />

            </label>

            <label className="block">

              <span className="body-emphasized-14pt mb-1 block">Role</span>

              <input className="pd-input" value={role} onChange={(e) => setRole(e.target.value)} />

            </label>

          </div>



          <label className="block">

            <span className="body-emphasized-14pt mb-1 block">Job description</span>

            <textarea

              className="pd-textarea min-h-[200px]"

              value={jobDescription}

              onChange={(e) => setJobDescription(e.target.value)}

              placeholder="Paste the full job posting for role-specific tailoring..."

            />

          </label>



          <div className="flex flex-wrap gap-3">

            <ActionButton loading={task.active} onClick={generate}>

              Generate cover letter

            </ActionButton>

          </div>

        </div>



        <div className="pd-careeros-letter-preview">

          {letter ? (

            <>

              <div className="mb-4 flex flex-wrap gap-2">

                <ActionButton variant="secondary" onClick={copy}>

                  Copy

                </ActionButton>

                <ActionButton variant="secondary" onClick={exportLetter}>

                  Export

                </ActionButton>

              </div>

              <textarea

                className="pd-textarea min-h-[400px] w-full border-0 bg-transparent font-[var(--font-manrope)] text-sm shadow-none"

                value={letter}

                onChange={(e) => {

                  setLetter(e.target.value);

                  updateProfile({ coverLetterText: e.target.value });

                }}

              />

            </>

          ) : (

            <div className="flex h-full min-h-[320px] items-center justify-center text-center">

              <p className="pd-careeros-muted max-w-xs">

                Your cover letter preview will appear here after generation.

              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}


