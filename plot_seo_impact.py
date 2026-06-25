import matplotlib.pyplot as plt
import numpy as np

# Set standard styles
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['text.color'] = '#1F2D3D'
plt.rcParams['axes.labelcolor'] = '#1F2D3D'
plt.rcParams['xtick.color'] = '#1F2D3D'
plt.rcParams['ytick.color'] = '#1F2D3D'

def generate_seo_impact():
    time_periods = ['Mois 1', 'Mois 3', 'Mois 6', 'Mois 12 (1 an)', 'Mois 24 (2 ans)', 'Mois 36 (3 ans)']
    articles = [5, 20, 50, 110, 200, 290]
    impressions = [800, 4500, 18000, 65000, 145000, 260000] # Monthly Search & AI Impressions

    # Increase width to avoid overlapping x-labels
    fig, ax1 = plt.subplots(figsize=(7, 4), dpi=300)
    fig.patch.set_facecolor('#F8FAFC')
    ax1.set_facecolor('#FFFFFF')

    # Grid
    ax1.grid(color='#E2E8F0', linestyle='--', linewidth=0.7, zorder=0)

    # Bar chart for articles
    color_bar = '#64748B' # Slate-500
    bars = ax1.bar(time_periods, articles, color=color_bar, width=0.45, label='Articles Publiés (Cumul)', zorder=3, alpha=0.9)
    ax1.set_ylabel("Articles Publiés", color=color_bar, fontsize=9, fontweight='bold')
    ax1.tick_params(axis='y', labelcolor=color_bar)
    
    # Place article values INSIDE the bars (in white text) to prevent overlap with line labels
    for bar in bars:
        height = bar.get_height()
        # Place text inside the bar at 80% height if bar is tall enough, else at top
        y_pos = height * 0.75 if height > 15 else height / 2
        ax1.annotate(f'{height}',
                    xy=(bar.get_x() + bar.get_width() / 2, y_pos),
                    xytext=(0, 0),
                    textcoords="offset points",
                    ha='center', va='center', fontsize=9, color='#FFFFFF', fontweight='bold')

    # Second axis for impressions
    ax2 = ax1.twinx()
    color_line = '#D59B2B' # Gold
    ax2.plot(time_periods, impressions, color=color_line, linewidth=3, marker='o', markersize=6, label='Impressions Google/Yahoo/IA', zorder=4)
    ax2.set_ylabel("Impressions Mensuelles (Google / IA)", color=color_line, fontsize=9, fontweight='bold')
    ax2.tick_params(axis='y', labelcolor=color_line)

    # Add values to the line points (impressions), shifted upwards to ensure clarity
    for i, val in enumerate(impressions):
        if val >= 1000:
            val_str = f'{val/1000:.0f}k' if val < 1000000 else f'{val/1000000:.1f}M'
        else:
            val_str = str(val)
        ax2.annotate(val_str,
                    xy=(time_periods[i], val),
                    xytext=(0, 8), # Shifting up by 8 points
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=8.5, color=color_line, fontweight='bold',
                    bbox=dict(boxstyle="round,pad=0.2", fc='#FFFFFF', ec='#E2E8F0', lw=0.5, alpha=0.85))

    # Title
    plt.title("Impact du Contenu sur la Visibilité Globale (1 à 3 ans)", fontsize=11, fontweight='bold', pad=12, color='#1F2D3D')

    # Clean spines
    for ax in [ax1, ax2]:
        for spine in ['top']:
            ax.spines[spine].set_visible(False)
        ax.spines['left'].set_color('#E2E8F0')
        ax.spines['right'].set_color('#E2E8F0')
        ax.spines['bottom'].set_color('#E2E8F0')

    # Rotate x labels slightly to prevent overlap
    ax1.tick_params(axis='x', rotation=15, labelsize=8.5)
    plt.tight_layout()

    plt.savefig('seo_impact.png', facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    print("SEO impact chart updated successfully.")

if __name__ == '__main__':
    generate_seo_impact()
