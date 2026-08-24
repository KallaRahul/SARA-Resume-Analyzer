import { useNavigate } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { UploadDropzone } from "@/components/resume/UploadDropzone";
import { ResumeRow } from "@/components/resume/ResumeRow";
import { useResumesList } from "@/hooks/useResumes";

export default function Resumes() {
  const nav = useNavigate();
  const { data: resumes, isLoading } = useResumesList();

  function handleUploaded(resume) {
    nav(`/resumes/${resume._id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumes Vault"
        description="Upload a new resume PDF for instant AI scoring or manage your version history."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
            <CardHeader className="!mb-4">
              <div>
                <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-400" />
                  Upload & Scan PDF
                </CardTitle>
                <CardDescription className="mt-1">
                  Upload PDF to parse sections, compute ATS score, and generate AI bullet rewrites.
                </CardDescription>
              </div>
            </CardHeader>
            <UploadDropzone onUploaded={handleUploaded} />
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-3.5">
          {isLoading && (
            <>
              <Skeleton className="h-[96px] rounded-2xl" />
              <Skeleton className="h-[96px] rounded-2xl" />
              <Skeleton className="h-[96px] rounded-2xl" />
            </>
          )}

          {!isLoading && resumes?.length === 0 && (
            <EmptyState
              icon={FileText}
              title="No resumes in vault yet"
              description="Upload your first resume PDF on the left to get instant ATS scores, keyword matches, and bullet rewrites."
            />
          )}

          {!isLoading &&
            resumes?.map((r) => <ResumeRow key={r._id} resume={r} />)}
        </div>
      </div>
    </div>
  );
}
