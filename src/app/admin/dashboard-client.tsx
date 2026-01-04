"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Search, Building, CheckCircle, XCircle, Trash2, UserCheck, MoreVertical, Mail, ExternalLink, Loader2, Pencil, Eye, FileText, Check, X, LogIn, LogOut } from "lucide-react";

interface User {
    id: string;
    email: string;
    role: string;
    created_at: string;
    expert: {
        id: string;
        nom_entreprise: string;
        status: string;
        is_labeled?: boolean;
        ville: string;
        slug: string;
        representant_nom?: string;
        representant_prenom?: string;
        telephone?: string;
        expert_type?: string; // New Field
    } | null;
}

export default function AdminDashboardClient({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loadingMap, setLoadingMap] = useState<Record<string, string | null>>({});
    const [filterType, setFilterType] = useState<string>("all");
    const router = useRouter();

    const filteredUsers = users.filter(user => {
        if (filterType === "all") return true;
        if (filterType === "no_expert") return !user.expert;
        return user.expert?.expert_type === filterType;
    });

    const handleImpersonate = async (userId: string) => {
        setLoadingMap(prev => ({ ...prev, [userId]: 'impersonate' }));
        try {
            const res = await fetch("/api/admin/impersonate", {
                method: "POST",
                body: JSON.stringify({ userId }),
            });
            if (res.ok) {
                window.location.href = "/dashboard";
            } else {
                alert("Erreur lors de la connexion");
            }
        } catch (e) {
            alert("Erreur technique");
        }
        setLoadingMap(prev => ({ ...prev, [userId]: null }));
    };

    const handleAction = async (userId: string, action: 'delete' | 'validate_expert' | 'promote_admin' | 'toggle_label' | 'update_email', value?: boolean | string) => {
        if (action === 'delete' && !confirm("Supprimer définitivement cet utilisateur ?")) return;

        setLoadingMap(prev => ({ ...prev, [userId]: action }));
        try {
            if (action === 'delete') {
                const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
                if (res.ok) {
                    setUsers(prev => prev.filter(u => u.id !== userId));
                }
            } else {
                let payload: any = { action };
                if (action === 'promote_admin') payload.role = 'admin';
                if (action === 'toggle_label') payload.value = value;
                if (action === 'update_email') payload.email = value;

                const res = await fetch(`/api/admin/users/${userId}`, {
                    method: "PATCH",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    router.refresh();
                    if (action === 'validate_expert') {
                        setUsers(prev => prev.map(u => u.id === userId && u.expert ? { ...u, expert: { ...u.expert, status: 'active' } } : u));
                    }
                    if (action === 'suspend_expert' as any) {
                        setUsers(prev => prev.map(u => u.id === userId && u.expert ? { ...u, expert: { ...u.expert, status: 'suspended' } } : u));
                    }
                    if (action === 'toggle_label') {
                        setUsers(prev => prev.map(u => u.id === userId && u.expert ? { ...u, expert: { ...u.expert, is_labeled: value as boolean } } : u));
                    }
                    if (action === 'update_email') {
                        setUsers(prev => prev.map(u => u.id === userId ? { ...u, email: value as string } : u));
                        alert("Email mis à jour avec succès.");
                    }
                } else {
                    const data = await res.json();
                    alert("Erreur: " + (data.message || "Impossible de mettre à jour"));
                }
            }
        } catch (e) {
            console.error(e);
            alert("Erreur technique");
        }
        setLoadingMap(prev => ({ ...prev, [userId]: null }));
    };

    const handleEditEmail = (user: User) => {
        const newEmail = prompt("Nouvel email pour cet utilisateur :", user.email);
        if (newEmail && newEmail !== user.email) {
            if (newEmail.includes('@')) {
                handleAction(user.id, 'update_email', newEmail);
            } else {
                alert("Email invalide");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {users.filter(u => u.expert?.expert_type === 'cvc_climatisation').length} CVC •
                            {users.filter(u => u.expert?.expert_type === 'diagnostics_dpe').length} Diag •
                            {users.filter(u => u.expert?.expert_type === 'bureau_detude').length} Étude
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-100">Espace Éditorial</CardTitle>
                        <div className="h-4 w-4 text-amber-400 font-bold">G</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-400 mb-4">Gérer les articles officiels Gainable.fr</div>
                        <Button
                            variant="secondary"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none"
                            onClick={() => window.open('/dashboard/articles', '_blank')}
                        >
                            Rédiger un article ➜
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gestion des Utilisateurs</CardTitle>
                        <div className="mt-2">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[250px] bg-slate-50">
                                    <SelectValue placeholder="Filtrer par métier..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                                    <SelectItem value="cvc_climatisation">Installateurs CVC</SelectItem>
                                    <SelectItem value="diagnostics_dpe">Diagnostiqueurs</SelectItem>
                                    <SelectItem value="bureau_detude">Bureaux d'Études</SelectItem>
                                    <SelectItem value="no_expert">Comptes sans profil expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {filteredUsers.length} affichés
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 font-medium text-slate-500">Utilisateur</th>
                                    <th className="p-4 font-medium text-slate-500">Entreprise</th>
                                    <th className="p-4 font-medium text-slate-500">Métier</th>
                                    <th className="p-4 font-medium text-slate-500">Téléphone</th>
                                    <th className="p-4 font-medium text-slate-500 text-center">Label G</th>
                                    <th className="p-4 font-medium text-slate-500">Statut</th>
                                    <th className="p-4 font-medium text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">{user.email}</div>
                                                <button
                                                    onClick={() => handleEditEmail(user)}
                                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-sm hover:bg-slate-200"
                                                    title="Modifier l'email"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Inscrit le {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                            {user.role === 'admin' && <Badge className="mt-1 bg-black">Admin</Badge>}
                                        </td>
                                        <td className="p-4">
                                            {user.expert ? (
                                                <div>
                                                    <div className="font-semibold text-slate-700">{user.expert.nom_entreprise}</div>
                                                    <div className="text-xs text-slate-500">{user.expert.ville}</div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Pas de profil expert</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {user.expert ? (
                                                <div className="text-sm text-slate-700">
                                                    {user.expert.expert_type === 'cvc_climatisation' && <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Installateur</Badge>}
                                                    {user.expert.expert_type === 'diagnostics_dpe' && <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">Diagnostic</Badge>}
                                                    {user.expert.expert_type === 'bureau_detude' && <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Etude</Badge>}
                                                </div>
                                            ) : "-"}
                                        </td>
                                        <td className="p-4">
                                            {user.expert ? (
                                                <div className="text-sm text-slate-600 font-mono">
                                                    {user.expert.telephone || "-"}
                                                </div>
                                            ) : "-"}
                                        </td>
                                        {/* LABEL COLUMN */}
                                        <td className="p-4 text-center">
                                            {user.expert ? (
                                                <div className="flex justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!user.expert.is_labeled}
                                                        onChange={(e) => handleAction(user.id, 'toggle_label', e.target.checked)}
                                                        disabled={!!loadingMap[user.id]}
                                                        className="w-5 h-5 rounded border-slate-300 text-[#D59B2B] focus:ring-[#D59B2B] cursor-pointer"
                                                    />
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {user.expert ? (
                                                <Badge variant={user.expert.status === 'active' ? 'default' : 'secondary'} className={user.expert.status === 'active' ? 'bg-green-600' : ''}>
                                                    {user.expert.status}
                                                </Badge>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {/* VALIDATE */}
                                            {user.expert && user.expert.status !== 'active' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-green-200 hover:bg-green-50 text-green-700"
                                                    onClick={() => handleAction(user.id, 'validate_expert')}
                                                    disabled={!!loadingMap[user.id]}
                                                    title="Valider / Activer"
                                                >
                                                    {loadingMap[user.id] === 'validate_expert' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                </Button>
                                            )}

                                            {/* SUSPEND */}
                                            {user.expert && user.expert.status === 'active' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-amber-200 hover:bg-amber-50 text-amber-700"
                                                    onClick={() => handleAction(user.id, 'suspend_expert' as any)}
                                                    disabled={!!loadingMap[user.id]}
                                                    title="Suspendre / Désactiver"
                                                >
                                                    {loadingMap[user.id] === 'suspend_expert' ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 flex items-center justify-center font-bold">||</div>}
                                                </Button>
                                            )}

                                            {/* IMPERSONATE */}
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleImpersonate(user.id)}
                                                disabled={!!loadingMap[user.id]}
                                                title="Se connecter en tant que..."
                                            >
                                                {loadingMap[user.id] === 'impersonate' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                                            </Button>

                                            {/* DELETE */}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleAction(user.id, 'delete')}
                                                disabled={!!loadingMap[user.id]}
                                                title="Supprimer le compte"
                                            >
                                                {loadingMap[user.id] === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
