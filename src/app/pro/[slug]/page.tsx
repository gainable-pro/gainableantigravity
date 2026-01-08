
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin, Globe, Linkedin, Facebook, Youtube, CheckCircle,
    Building2, Wrench, GraduationCap, FileCheck, Mail
} from "lucide-react";
import { ContactWizard } from "@/components/features/contact/contact-wizard";
import { ExpertArticles } from "@/components/features/expert/expert-articles";
import { PhoneCallButton } from "@/components/features/expert/phone-call-button";
import { BrandLogo } from "@/components/ui/brand-logo";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getExpertBySlug(slug: string) {
    const expert = await prisma.expert.findUnique({
        where: { slug },
        include: {
            technologies: true,
            interventions_clim: true,
            interventions_etude: true,
            interventions_diag: true,
            batiments: true,
            marques: true,
            certifications: true,
            photos: true,
            articles: {
                where: { status: 'PUBLISHED' },
                orderBy: { createdAt: 'desc' }, // Updated to match main articles page
                take: 6,
                select: {
                    slug: true,
                    title: true,
                    introduction: true,
                    mainImage: true,
                    publishedAt: true,
                    createdAt: true // Need this for fallback
                }
            },
            user: {
                select: { email: true }
            }
        }
    });
    return expert;
}

import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const expert = await getExpertBySlug(slug);

    if (!expert) {
        return {
            title: "Expert introuvable - Gainable.fr",
            description: "Le profil de cet expert est introuvable."
        };
    }

    return {
        title: `${expert.nom_entreprise} - Expert à ${expert.ville} | Gainable.fr`,
        description: expert.description?.substring(0, 160) || `Contactez ${expert.nom_entreprise}, expert en génie climatique à ${expert.ville}. Devis gratuit et intervention rapide.`,
        alternates: {
            canonical: `/pro/${expert.slug}`,
        },
        openGraph: {
            title: `${expert.nom_entreprise} - Expert à ${expert.ville}`,
            description: expert.description?.substring(0, 160) || `Contactez ${expert.nom_entreprise} pour vos projets de climatisation.`,
            images: expert.logo_url ? [expert.logo_url] : ['/assets/logo-share.jpg'],
            type: 'profile',
        }
    };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const expert = await getExpertBySlug(slug);

    if (!expert) {
        notFound();
    }

    // Determine type label and color
    let typeLabel = "Expert";
    let typeColor = "bg-slate-100 text-slate-800";
    if (expert.expert_type === 'cvc_climatisation') {
        typeLabel = "Société CVC / Climatisation";
        typeColor = "bg-blue-100 text-blue-800";
    } else if (expert.expert_type === 'bureau_detude') {
        typeLabel = "Bureau d'Étude";
        typeColor = "bg-purple-100 text-purple-800";
    } else if (expert.expert_type === 'diagnostics_dpe') {
        typeLabel = "Diagnostiqueur Immobilier";
        typeColor = "bg-orange-100 text-orange-800";
    }

    // Video ID extractor
    const getYoutubeId = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const youtubeId = getYoutubeId(expert.video_url);

    // --- SEO: STRUCTURED DATA (JSON-LD) ---
    // Helps AI & Google understand this is a Local Business
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": expert.expert_type === 'cvc_climatisation' ? "HVACBusiness" :
            expert.expert_type === 'bureau_detude' ? "ProfessionalService" : "LocalBusiness",
        "name": expert.nom_entreprise,
        "image": expert.logo_url || "https://gainable.fr/assets/logo-share.jpg", // Fallback image
        "@id": `https://gainable.fr/pro/${expert.slug}`,
        "url": `https://gainable.fr/pro/${expert.slug}`,
        "telephone": expert.telephone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": expert.adresse,
            "addressLocality": expert.ville,
            "postalCode": expert.code_postal,
            "addressCountry": expert.pays || "FR"
        },
        "description": expert.description?.substring(0, 160) || `Expert ${typeLabel} à ${expert.ville}.`,
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": expert.lat || 46.2276,
                "longitude": expert.lng || 2.2137
            },
            "geoRadius": expert.intervention_radius ? `${expert.intervention_radius * 1000}` : "50000"
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />


            <main className="container mx-auto px-4 py-8">
                {/* --- HEADER PROFILE NEW --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                    {/* Dynamic Hero Background */}
                    <div className="h-48 relative">
                        <div className="absolute inset-0 bg-slate-800/20 z-10"></div>
                        <img
                            src={
                                expert.expert_type === 'cvc_climatisation' ? "/assets/images/hero-cvc.png" :
                                    expert.expert_type === 'bureau_detude' ? "/assets/images/hero-bureau.png" :
                                        "/assets/images/hero-diag.png"
                            }
                            alt="Fond expert"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-start gap-6 -mt-32 relative z-20">
                            {/* LOGO */}
                            <div className="w-72 h-72 bg-white rounded-xl shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
                                {expert.logo_url ? (
                                    <img src={expert.logo_url} alt={expert.nom_entreprise} className="w-full h-full object-contain p-4" />
                                ) : (
                                    <span className="text-6xl font-bold text-slate-300">{expert.nom_entreprise.charAt(0)}</span>
                                )}
                            </div>

                            {/* INFO MAIN */}
                            <div className="flex-1 pt-32 md:pt-4">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-bold text-[#1F2D3D]">{expert.nom_entreprise}</h1>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${typeColor}`}>
                                                {typeLabel}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm font-medium">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-[#D59B2B]" /> {expert.ville} ({expert.code_postal}), {expert.pays}
                                            </span>
                                            {expert.site_web && (
                                                <a href={expert.site_web.startsWith('http') ? expert.site_web : `https://${expert.site_web}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#D59B2B] transition-colors">
                                                    <Globe className="w-4 h-4" /> Site web
                                                </a>
                                            )}
                                            {expert.linkedin && (
                                                <a href={expert.linkedin.startsWith('http') ? expert.linkedin : `https://${expert.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#0077b5] transition-colors">
                                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                                </a>
                                            )}
                                            {expert.facebook && (
                                                <a href={expert.facebook.startsWith('http') ? expert.facebook : `https://${expert.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#1877F2] transition-colors">
                                                    <Facebook className="w-4 h-4" /> Facebook
                                                </a>
                                            )}
                                            {expert.youtube && (
                                                <a href={expert.youtube.startsWith('http') ? expert.youtube : `https://${expert.youtube}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#FF0000] transition-colors">
                                                    <Youtube className="w-4 h-4" /> YouTube
                                                </a>
                                            )}
                                        </div>
                                    </div>



                                    {/* ACTIONS BAR */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <PhoneCallButton telephone={expert.telephone} />
                                        <ContactWizard
                                            preSelectedExperts={[{
                                                id: expert.id,
                                                nom_entreprise: expert.nom_entreprise,
                                                expert_type: expert.expert_type,
                                                ville: expert.ville
                                            }]}
                                            triggerButton={
                                                <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-12 px-8 shadow-md">
                                                    Demander un devis
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LEFT COLUMN: DETAILS --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* DESCRIPTION */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-[#1F2D3D] mb-4">À propos</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {expert.description || "Aucune description renseignée."}
                            </p>
                        </section>

                        {/* VIDEO / MEDIA */}
                        {expert.video_url && (
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                                <h2 className="text-xl font-bold text-[#1F2D3D] mb-4">Présentation Vidéo</h2>
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
                                    {/* Support for YouTube embed or standard video tag */}
                                    {youtubeId ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&mute=1`}
                                            title="Video user"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video
                                            src={expert.video_url}
                                            controls
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </section>
                        )}

                        {/* GALLERY PHOTOS */}
                        {expert.photos && expert.photos.length > 0 && (
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                                <h2 className="text-xl font-bold text-[#1F2D3D] mb-4">Galerie Photos</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {expert.photos.map((photo, idx) => (
                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                            <img
                                                src={photo.photo_url}
                                                alt={`Réalisation ${expert.nom_entreprise} ${idx + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SKILLS / TAGS */}
                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-[#1F2D3D] mb-6">Expertise & Compétences</h2>

                            {/* CVC SPECIFIC */}
                            {expert.technologies.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <Wrench className="w-4 h-4" /> Technologies Maîtrisées
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {expert.technologies.map((t) => (
                                            <Badge key={t.id} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-[#FFF8ED] hover:text-[#D59B2B] px-3 py-1.5 text-sm">
                                                {t.value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {expert.interventions_clim.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Types d'interventions
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {expert.interventions_clim.map((t) => (
                                            <Badge key={t.id} variant="outline" className="border-slate-200 text-slate-600 px-3 py-1.5 text-sm">
                                                {t.value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* BATIMENTS */}
                            {expert.batiments.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> Types de Bâtiments
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {expert.batiments.map((t) => (
                                            <Badge key={t.id} variant="outline" className="border-slate-200 text-slate-600 px-3 py-1.5 text-sm">
                                                {t.value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* BUREAU ETUDE */}
                            {expert.interventions_etude.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" /> Missions d'Étude
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {expert.interventions_etude.map((t) => (
                                            <Badge key={t.id} variant="secondary" className="bg-purple-50 text-purple-700 px-3 py-1.5 text-sm">
                                                {t.value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* DIAGNOSTICS */}
                            {expert.interventions_diag.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                        <FileCheck className="w-4 h-4" /> Diagnostics Réalisés
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {expert.interventions_diag.map((t) => (
                                            <Badge key={t.id} variant="secondary" className="bg-orange-50 text-orange-700 px-3 py-1.5 text-sm">
                                                {t.value}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* MARQUES */}
                            {expert.marques.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-[#1F2D3D] mb-4">Marques travaillées</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {expert.marques.length > 0 ? (
                                            expert.marques.map((marque) => (
                                                <div key={marque.id} title={marque.value}>
                                                    <BrandLogo brand={marque.value} size={48} />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-500 italic">Non renseigné</p>
                                        )}
                                    </div>
                                </div>

                            )}

                            {/* CERTIFICATIONS */}
                            {expert.certifications && expert.certifications.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <h2 className="text-xl font-bold text-[#1F2D3D] mb-4">Labels & Certifications</h2>
                                    <div className="flex flex-wrap items-center gap-6">
                                        {expert.certifications.map((cert) => (
                                            <div key={cert.id} className="flex flex-col items-center gap-2 group">
                                                <div className="h-16 w-auto flex items-center justify-center p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-[#D59B2B]/30 transition-colors">
                                                    {cert.value === 'RGE QualiPAC' ? (
                                                        <img src="/assets/images/rge-logo.png" alt="RGE QualiPAC" className="h-full w-auto object-contain" />
                                                    ) : (
                                                        <div className="h-full flex items-center gap-2 px-3">
                                                            <CheckCircle className="w-6 h-6 text-[#D59B2B]" />
                                                            <span className="font-semibold text-slate-700 text-sm max-w-[100px] text-center leading-tight">{cert.value}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* --- ARTICLES CAROUSEL --- */}
                        <ExpertArticles
                            articles={expert.articles}
                            expertSlug={expert.slug}
                            expertName={expert.nom_entreprise}
                        />

                    </div>

                    {/* --- RIGHT COLUMN: CONTACT & MAP --- */}
                    <div className="space-y-6">
                        {/* MAP WIDGET */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-64 relative z-0">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(expert.ville + ", " + expert.pays)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            ></iframe>
                            {/* Overlay Custom Marker Mockup (Visual only as iframe captures clicks) */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 pointer-events-none">
                                <img
                                    src="/assets/map-marker-g.jpg"
                                    className="w-12 h-12 rounded-full border-2 border-white drop-shadow-md object-cover"
                                    alt="Marker"
                                />
                            </div>
                        </div>

                        <div className="sticky top-24">
                            {/* Passing the expert to the Wizard to pre-select them */}
                            <ContactWizard
                                preSelectedExperts={[{
                                    id: expert.id,
                                    nom_entreprise: expert.nom_entreprise,
                                    expert_type: expert.expert_type,
                                    ville: expert.ville
                                }]}
                                triggerButton={
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-4 cursor-pointer hover:shadow-md transition-shadow group">
                                        <div className="w-16 h-16 bg-[#FFF8ED] text-[#D59B2B] rounded-full flex items-center justify-center mx-auto group-hover:bg-[#D59B2B] group-hover:text-white transition-colors">
                                            <Mail className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#1F2D3D]">Demander un devis</h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Obtenez une réponse rapide pour votre projet.
                                            </p>
                                        </div>
                                        <Button className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-12">
                                            Remplir le formulaire
                                        </Button>
                                    </div>
                                }
                            />

                            <div className="flex justify-center mt-4">
                                {expert.is_labeled && (
                                    <img src="/expert-verifie-logo-v3.jpg" alt="Expert Vérifié" className="h-24 w-auto object-contain" />
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
}
