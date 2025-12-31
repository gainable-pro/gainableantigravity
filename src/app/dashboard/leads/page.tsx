import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function getExpertId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const expert = await prisma.expert.findUnique({
            where: { user_id: decoded.userId },
            select: { id: true }
        });
        return expert?.id;
    } catch (e) {
        return null;
    }
}

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
    const expertId = await getExpertId();

    if (!expertId) {
        return <div className="p-10 text-center">Veuillez vous connecter.</div>;
    }

    const assignments = await prisma.leadAssignment.findMany({
        where: { expertId: expertId },
        include: {
            lead: true
        },
        orderBy: { sentAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#1F2D3D]">Mes Demandes (Leads)</h2>
                <p className="text-slate-500">Retrouvez ici toutes les demandes reçues via Gainable.fr</p>
            </div>

            {assignments.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center text-slate-500">
                        Aucune demande reçue pour le moment.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {assignments.map(({ lead, sentAt }) => {
                        const message = (lead.details as any)?.message || (lead.details as any)?.description || "";
                        const surface = (lead.details as any)?.surface;
                        const projet = (lead.details as any)?.active_search || (lead.details as any)?.projet || "";
                        const files = (lead.details as any)?.files;

                        return (
                            <Card key={lead.id} className="overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b pb-3">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={lead.status === 'new' ? "default" : "secondary"} className="bg-[#D59B2B] hover:bg-[#b88622]">
                                                {lead.type.toUpperCase()}
                                            </Badge>
                                            <span className="font-semibold text-[#1F2D3D]">{lead.prenom} {lead.nom}</span>
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            Reçu le {format(new Date(sentAt), "d MMMM yyyy à HH:mm", { locale: fr })}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 grid md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase text-slate-400">Contact</p>
                                        <div className="text-sm">
                                            <p>{lead.telephone}</p>
                                            <p className="text-[#D59B2B]">{lead.email}</p>
                                            <p>{lead.ville} ({lead.code_postal})</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <p className="text-xs font-bold uppercase text-slate-400">Projet</p>
                                        <div className="text-sm space-y-2">
                                            <div className="flex gap-4">
                                                {projet && <Badge variant="outline">{projet}</Badge>}
                                                {surface && <Badge variant="outline">{surface} m²</Badge>}
                                            </div>
                                            {message && (
                                                <div className="bg-slate-50 p-3 rounded text-slate-600 italic border">
                                                    "{message}"
                                                </div>
                                            )}

                                            {/* Files */}
                                            {files && files.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs font-bold uppercase text-slate-400">Pièces jointes</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {files.map((file: any, index: number) => (
                                                            <a
                                                                key={index}
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs flex items-center gap-1 text-[#D59B2B] hover:underline bg-orange-50 px-2 py-1 rounded border border-orange-100"
                                                            >
                                                                📎 {file.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
