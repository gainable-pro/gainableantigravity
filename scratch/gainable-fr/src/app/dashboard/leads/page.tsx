import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Ensure global prisma
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

export default async function LeadsPage() {
    // ---------------------------------------------------------
    // TEMP: MOCK AUTH until Auth module is fully integrated
    // We fetch the first expert to simulate a logged-in pro
    // ---------------------------------------------------------
    const demoExpert = await prisma.expert.findFirst();

    if (!demoExpert) {
        return <div className="p-8">Aucun expert trouvé en base pour la démo.</div>;
    }

    const assignments = await prisma.leadAssignment.findMany({
        where: { expertId: demoExpert.id },
        include: { lead: true },
        orderBy: { sentAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1F2D3D]">Mes Demandes (Leads)</h1>
                    <p className="text-slate-500 text-sm">
                        Connecté en tant que: <span className="font-semibold text-slate-800">{demoExpert.nom_entreprise}</span> (Démo)
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-white">
                    {assignments.length} demande(s)
                </Badge>
            </header>

            {assignments.length === 0 ? (
                <Card className="text-center py-12 border-dashed border-slate-300 shadow-none bg-slate-50/50">
                    <p className="text-slate-500">Aucune demande reçue pour le moment.</p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {assignments.map((assignment) => {
                        const lead = assignment.lead;
                        const details = lead.details as any || {}; // Cast json

                        return (
                            <Card key={assignment.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            {lead.type === 'cvc' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Installation CVC</Badge>}
                                            {lead.type === 'diag' && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">Diagnostic</Badge>}
                                            {lead.type === 'simple' && <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">Contact</Badge>}

                                            <span className="text-xs text-slate-400 font-medium">
                                                Reçu le {format(new Date(assignment.sentAt), "d MMMM yyyy à HH:mm", { locale: fr })}
                                            </span>
                                        </div>
                                        <Badge variant={assignment.status === 'sent' ? 'default' : 'secondary'} className={assignment.status === 'sent' ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : ""}>
                                            {assignment.status === 'sent' ? 'Nouveau' : assignment.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
                                    {/* Contact Info */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Contact</h3>
                                        <div className="space-y-1 text-sm text-slate-600">
                                            <p><span className="font-semibold text-slate-800">{lead.nom} {lead.prenom}</span></p>
                                            <p>{lead.adresse}</p>
                                            <p>{lead.code_postal} {lead.ville}</p>
                                            <div className="pt-2 flex flex-col gap-1">
                                                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline flex items-center gap-2">
                                                    ✉️ {lead.email}
                                                </a>
                                                <a href={`tel:${lead.telephone}`} className="text-blue-600 hover:underline flex items-center gap-2">
                                                    📞 {lead.telephone}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Details */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Détails du projet</h3>
                                        <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                                            {Object.entries(details).length > 0 ? (
                                                <ul className="space-y-1">
                                                    {Object.entries(details).map(([key, value]) => (
                                                        key !== 'nom' && key !== 'prenom' && key !== 'email' && key !== 'telephone' && key !== 'ville' && key !== 'code_postal' && key !== 'adresse' && (
                                                            <li key={key} className="flex justify-between border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                                                                <span className="font-medium text-slate-700 capitalize">{key.replace(/_/g, ' ')}:</span>
                                                                <span>{String(value)}</span>
                                                            </li>
                                                        )
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="italic text-slate-400">Aucun détail supplémentaire.</p>
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
