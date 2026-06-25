import matplotlib.pyplot as plt
import numpy as np

# Set standard styles
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['text.color'] = '#1F2D3D'
plt.rcParams['axes.labelcolor'] = '#1F2D3D'
plt.rcParams['xtick.color'] = '#1F2D3D'
plt.rcParams['ytick.color'] = '#1F2D3D'

def generate_seo_curve():
    months = ['Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6', 'Mois 7', 'Mois 8', 'Mois 9', 'Mois 10', 'Mois 11', 'Mois 12']
    # Exponential-like growth curve for SEO Visibility index
    visibility = [10, 15, 25, 45, 80, 150, 310, 520, 780, 1100, 1450, 1900]
    
    fig, ax = plt.subplots(figsize=(6, 3.5), dpi=300)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#FFFFFF')
    
    # Grid lines
    ax.grid(color='#E2E8F0', linestyle='--', linewidth=0.7, zorder=0)
    
    # Plot line
    ax.plot(months, visibility, color='#D59B2B', linewidth=3, marker='o', markersize=6, label='Visibilité SEO Organique', zorder=3)
    ax.fill_between(months, visibility, color='#D59B2B', alpha=0.15, zorder=2)
    
    # Title & Labels
    ax.set_title("Croissance de la Visibilité SEO Locale (Gainable.fr)", fontsize=11, fontweight='bold', pad=12, color='#1F2D3D')
    ax.set_ylabel("Index de Visibilité (Google)", fontsize=9, fontweight='bold')
    
    # Clean spines
    for spine in ['top', 'right']:
        ax.spines[spine].set_visible(False)
    ax.spines['left'].set_color('#E2E8F0')
    ax.spines['bottom'].set_color('#E2E8F0')
    
    plt.xticks(rotation=45, fontsize=8)
    plt.yticks(fontsize=8)
    plt.tight_layout()
    
    plt.savefig('seo_curve.png', facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print("SEO curve chart generated.")

def generate_ca_growth():
    labels = ['Sans Gainable.fr', 'Avec Gainable.fr\n(Année 1)', 'Avec Gainable.fr\n(Année 2)']
    ca_values = [28000, 78000, 142000] # €
    colors = ['#64748B', '#D59B2B', '#10B981'] # Slate-500, Gainable Gold, Emerald
    
    fig, ax = plt.subplots(figsize=(6, 3.5), dpi=300)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#FFFFFF')
    
    # Grid lines
    ax.grid(axis='y', color='#E2E8F0', linestyle='--', linewidth=0.7, zorder=0)
    
    # Plot bars
    bars = ax.bar(labels, ca_values, color=colors, width=0.5, zorder=3, edgecolor='none')
    
    # Add values on top of bars
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:,} €',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=9, fontweight='bold')
                    
    # Title & Labels
    ax.set_title("Progression du Chiffre d'Affaires Moyen (CVC & PAC)", fontsize=11, fontweight='bold', pad=12, color='#1F2D3D')
    ax.set_ylabel("Volume d'Affaires Généré (€)", fontsize=9, fontweight='bold')
    
    # Clean spines
    for spine in ['top', 'right']:
        ax.spines[spine].set_visible(False)
    ax.spines['left'].set_color('#E2E8F0')
    ax.spines['bottom'].set_color('#E2E8F0')
    
    plt.xticks(fontsize=8, fontweight='bold')
    plt.yticks(fontsize=8)
    plt.tight_layout()
    
    plt.savefig('ca_growth.png', facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print("CA growth chart generated.")

if __name__ == '__main__':
    generate_seo_curve()
    generate_ca_growth()
