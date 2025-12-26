"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminPendingList() {
    const [experts, setExperts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin/pending')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Not admin or error");
            })
            .then(data => setExperts(data))
            .catch(() => setExperts([])) // Hide if error/not admin
            .finally(() => setLoading(false));
    }, []);

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            const res = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expertId: id })
            });
            if (res.ok) {
                setExperts(prev => prev.filter(e => e.id !== id));
            }
        } catch (e) {
            alert("Erreur");
        }
        setActionLoading(null);
    };

    if (!loading && experts.length === 0) return null; // Don't show if empty or not admin

    return (
        <Card className="border-orange-200 bg-orange-50 mb-8">
            <CardContent className="pt-6">
                <h3 className="font-bold text-lg text-orange-800 mb-4 flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-pulse" />
                    Validations en attente ({experts.length})
                </h3>
                <div className="space-y-3">
                    {experts.map(expert => (
                        <div key={expert.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="font-bold text-[#1F2D3D]">{expert.nom_entreprise}</div>
                                <div className="text-sm text-slate-500">
                                    {expert.represented_prenom} {expert.representant_nom} • {expert.ville} ({expert.code_postal})
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                    Expert: {expert.expert_type} • Inscrit le {format(new Date(expert.created_at), 'dd MMM yyyy', { locale: fr })}
                                </div>
                            </div>
                            <Button
                                onClick={() => handleApprove(expert.id)}
                                disabled={actionLoading === expert.id}
                                className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                            >
                                {actionLoading === expert.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                Valider
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
