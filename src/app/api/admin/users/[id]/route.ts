import { NextResponse } from "next/server";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return unauthorized();

    const { id } = await params;

    try {
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ message: "User deleted" });
    } catch (e) {
        return NextResponse.json({ message: "Error deleting user" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return unauthorized();

    const { id } = await params;
    const body = await req.json();

    // Update Expert Status
    if (body.action === 'validate_expert') {
        try {
            await prisma.expert.update({
                where: { user_id: id },
                data: { status: 'active' }
            });
            return NextResponse.json({ message: "Expert validated" });
        } catch (e) {
            return NextResponse.json({ message: "Error updating expert" }, { status: 500 });
        }
    }

    if (body.action === 'suspend_expert') {
        try {
            await prisma.expert.update({
                where: { user_id: id },
                data: { status: 'suspended' }
            });
            return NextResponse.json({ message: "Expert suspended" });
        } catch (e) {
            return NextResponse.json({ message: "Error updating expert" }, { status: 500 });
        }
    }

    // Toggle Label
    if (body.action === 'toggle_label') {
        try {
            await prisma.expert.update({
                where: { user_id: id },
                data: { is_labeled: body.value }
            });
            return NextResponse.json({ message: "Label updated" });
        } catch (e) {
            return NextResponse.json({ message: "Error updating label" }, { status: 500 });
        }
    }

    // Update User Role (e.g. promote to admin)
    if (body.action === 'update_role') {
        try {
            await prisma.user.update({
                where: { id: id },
                data: { role: body.role }
            });
            return NextResponse.json({ message: "Role updated" });
        } catch (e) {
            return NextResponse.json({ message: "Error updating role" }, { status: 500 });
        }
    }

    // Update User Email
    if (body.action === 'update_email') {
        const { email } = body;
        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: "Invalid email" }, { status: 400 });
        }

        try {
            // Check uniqueness
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing && existing.id !== id) {
                return NextResponse.json({ message: "Email already taken" }, { status: 409 });
            }

            await prisma.user.update({
                where: { id: id },
                data: { email: email }
            });
            return NextResponse.json({ message: "Email updated" });
        } catch (e) {
            return NextResponse.json({ message: "Error updating email" }, { status: 500 });
        }
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
