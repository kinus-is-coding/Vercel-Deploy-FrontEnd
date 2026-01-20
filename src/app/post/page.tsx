"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import FeatureList from "@/components/FeatureList";
import { useRouter, useSearchParams } from "next/navigation";

type Feature = string;

function PostContent() {
    const router = useRouter();
    const [features, setFeatures] = useState<Feature[]>([]);
    const [manualItem, setManualItem] = useState("");
    const [manualLocation, setManualLocation] = useState("");
    const [manualDescription, setManualDescription] = useState("");
    const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const lockerId = searchParams?.get('locker');

    const manualFeatures = useMemo(() => {
        const list: Feature[] = [];
        if (manualItem.trim()) list.push(`Item: ${manualItem.trim()}`);
        if (manualLocation.trim()) list.push(`Location: ${manualLocation.trim()}`);
        if (manualDescription.trim())
            list.push(`Description: ${manualDescription.trim()}`);
        return list;
    }, [manualItem, manualLocation, manualDescription]);

    async function handleCreateQuizFromManual() {
        if (manualFeatures.length < 3) {
            setError("Vui lòng điền đủ 3 thông tin để tạo quiz.");
            return;
        }
        setError(null);
        setIsCreatingQuiz(true);
        try {
            const res = await fetch(`/api/create-quiz?locker=${lockerId || ''}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    features: manualFeatures,
                    source: "manual",
                }),
            });

            if (!res.ok) {
                const errorDetail = await res.json().catch(() => ({}));
                setIsCreatingQuiz(false);
                if (errorDetail.message || errorDetail.error) {
                    setError(errorDetail.message || errorDetail.error);
                    return;
                }
                throw new Error("Failed to create quiz");
            }
            router.push('/');
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối. Vui lòng thử lại.");
            setIsCreatingQuiz(false);
        }
    }

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            {/* Header Section */}
            <section className="space-y-3 px-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Check if a lost item is really yours
                </h2>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                    Describe your item. We&apos;ll extract
                    identifying features and turn them into a short quiz.
                </p>
            </section>

            {error && (
                <div className="rounded-xl border border-red-500/50 bg-red-950/20 px-4 py-3 text-sm text-red-200 animate-shake">
                    ⚠️ {error}
                </div>
            )}

            <section className="grid gap-6">
                <div className="space-y-6">
                    {/* Form Container - Dùng màu nền đặc để không bị bạc màu trên mobile */}
                    <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0f172a] p-5 md:p-6 shadow-xl">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 ml-1">Item Name</label>
                            <input
                                value={manualItem}
                                onChange={(e) => setManualItem(e.target.value)}
                                placeholder="e.g. Notebooks thienlong"
                                className="w-full rounded-xl border border-white/5 bg-[#070b14] px-4 py-4 text-base text-slate-50 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 ml-1">Location Found</label>
                            <input
                                value={manualLocation}
                                onChange={(e) => setManualLocation(e.target.value)}
                                placeholder="e.g. Near the library entrance"
                                className="w-full rounded-xl border border-white/5 bg-[#070b14] px-4 py-4 text-base text-slate-50 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 ml-1">Verification Details</label>
                            <textarea
                                value={manualDescription}
                                onChange={(e) => setManualDescription(e.target.value)}
                                placeholder="Describe details only the owner knows..."
                                rows={4}
                                className="w-full rounded-xl border border-white/5 bg-[#070b14] px-4 py-4 text-base text-slate-50 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="space-y-3 px-1">
                        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                            Features preview
                        </h4>
                        <div className="rounded-2xl bg-slate-900/40 p-1">
                            <FeatureList
                                features={manualFeatures}
                                onChange={setFeatures}
                                readOnly
                                placeholder="No manual features yet. Fill in the form above."
                            />
                        </div>
                    </div>

                    {/* Submit Button - To, rõ, dễ bấm trên mobile */}
                    <button
                        type="button"
                        onClick={handleCreateQuizFromManual}
                        disabled={manualFeatures.length < 3 || isCreatingQuiz}
                        className="w-full flex items-center justify-center rounded-2xl bg-indigo-600 py-5 text-base font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        {isCreatingQuiz ? (
                             <div className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Creating quiz...
                             </div>
                        ) : "Create Quiz Now"}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default function PostPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-slate-500 font-medium">Loading interface...</div>}>
            <PostContent />
        </Suspense>
    );
}