
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

// HELPER: Verify User
async function getUserIdFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

// GET: Fetch Full Profile
export async function GET() {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const expert = await prisma.expert.findUnique({
            where: { user_id: userId },
            include: {
                technologies: true,
                interventions_clim: true,
                interventions_etude: true,
                interventions_diag: true,
                batiments: true,
                marques: true,
                certifications: true,
                user: {
                    select: {
                        role: true,
                        email: true
                    }
                }
            }
        });

        if (!expert) return NextResponse.json({ message: "Expert not found" }, { status: 404 });
        return NextResponse.json(expert);
    } catch (error: any) {
        console.error("GET Profile Error:", error);
        return NextResponse.json(
            { message: `Error fetching profile: ${error?.message || String(error)}` },
            { status: 500 }
        );
    }
}

// PUT: Update Profile
export async function PUT(req: Request) {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        // Use Transaction to handle updates + relations
        const updatedExpert = await prisma.$transaction(async (tx) => {
            // 1. Update Scalar Fields
            const expert = await tx.expert.update({
                where: { user_id: userId },
                data: {
                    nom_entreprise: body.nom_entreprise,
                    representant_nom: body.representant_nom,
                    representant_prenom: body.representant_prenom,
                    adresse: body.adresse,
                    ville: body.ville,
                    code_postal: body.code_postal,
                    pays: body.pays,
                    description: body.description,
                    site_web: body.site_web,
                    linkedin: body.linkedin,
                    facebook: body.facebook,
                    youtube: body.youtube,
                    telephone: body.telephone,
                    lat: body.lat,
                    lng: body.lng,
                    intervention_radius: body.intervention_radius ? parseInt(body.intervention_radius) : 50,
                    // Adresse d'intervention
                    adresse_indep: body.adresse_indep,
                    adresse_inter: body.adresse_inter,
                    ville_inter: body.ville_inter,
                    cp_inter: body.cp_inter,
                    // SEO
                    metaTitle: body.metaTitle,
                    metaDesc: body.metaDesc,
                }
            });

            const expertId = expert.id;

            // 2. Helper to Update Relations (Delete All + Create New)
            // Note: In a real "Update" scenario for large datasets this might be inefficient, 
            // but for simple tag lists (technologies etc) it's the cleanest way to sync.
            // Checkbox groups strictly depend on ExpertType (handled by frontend), 
            // but backend receives full arrays.

            // TECHNOLOGIES
            if (body.technologies) {
                await tx.expertTechnology.deleteMany({ where: { expert_id: expertId } });
                if (body.technologies.length > 0) {
                    await tx.expertTechnology.createMany({
                        data: body.technologies.map((t: string) => ({ expert_id: expertId, value: t }))
                    });
                }
            }

            // INTERVENTIONS CLIM
            if (body.interventions_clim) {
                await tx.expertInterventionClim.deleteMany({ where: { expert_id: expertId } });
                if (body.interventions_clim.length > 0) {
                    await tx.expertInterventionClim.createMany({
                        data: body.interventions_clim.map((t: string) => ({ expert_id: expertId, value: t }))
                    });
                }
            }

            // INTERVENTIONS ETUDE
            if (body.interventions_etude) {
                await tx.expertInterventionEtude.deleteMany({ where: { expert_id: expertId } });
                if (body.interventions_etude.length > 0) {
                    await tx.expertInterventionEtude.createMany({
                        data: body.interventions_etude.map((t: string) => ({ expert_id: expertId, value: t }))
                    });
                }
            }

            // INTERVENTIONS DIAG
            if (body.interventions_diag) {
                await tx.expertInterventionDiag.deleteMany({ where: { expert_id: expertId } });
                if (body.interventions_diag.length > 0) {
                    await tx.expertInterventionDiag.createMany({
                        data: body.interventions_diag.map((t: string) => ({ expert_id: expertId, value: t }))
                    });
                }
            }

            // BATIMENTS
            if (body.batiments) {
                await tx.expertBatiment.deleteMany({ where: { expert_id: expertId } });
                if (body.batiments.length > 0) {
                    await tx.expertBatiment.createMany({
                        data: body.batiments.map((t: string) => ({ expert_id: expertId, value: t }))
                    });
                }
            }

            // MARQUES
            if (body.marques) {
                await tx.expertMarque.deleteMany({ where: { expert_id: expertId } });
                if (body.marques.length > 0) {
                    await tx.expertMarque.createMany({
                        data: body.marques.map((t: string) => ({ expert_id: expertId, value: t }))
                    });
                }
            }

            // CERTIFICATIONS
            if (body.certifications) {
                await tx.expertCertification.deleteMany({ where: { expert_id: expertId } });
                if (body.certifications.length > 0) {
                    await tx.expertCertification.createMany({
                        data: body.certifications.map((t: string) => ({ expert_id: expertId, value: t }))
                    });
                }
            }

            return expert;
        });

        return NextResponse.json({ message: "Profile updated", expert: updatedExpert });

    } catch (error) {
        console.error("PUT Profile Error:", error);
        // Log detailed error if it's a Prisma error
        if ((error as any).code) {
            console.error("Prisma Error Code:", (error as any).code);
            console.error("Prisma Error Meta:", (error as any).meta);
        }
        return NextResponse.json({ message: "Error updating profile", details: String(error) }, { status: 500 });
    }
}
