<!-- Activity Insights Detail (Minimal) -->
<!DOCTYPE html><html class="dark" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Cadence | Activity Insights</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary": "#FFFFFF",
                        "on-primary": "#000000",
                        "secondary": "#A1A1AA",
                        "background": "#000000",
                        "surface": "#121212",
                        "surface-container": "#18181B",
                        "surface-container-high": "#27272A",
                        "surface-container-low": "#09090B",
                        "surface-variant": "#3F3F46",
                        "on-surface": "#FAFAFA",
                        "on-surface-variant": "#A1A1AA",
                        "outline": "#52525B",
                        "outline-variant": "#27272A"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.5rem",
                        "lg": "0.75rem",
                        "xl": "1rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Manrope"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #000000;
            color: #FAFAFA;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .contribution-grid {
            display: grid;
            grid-template-columns: repeat(22, 1fr);
            gap: 4px;
        }
        .contribution-cell {
            aspect-ratio: 1/1;
            border-radius: 2px;
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen pb-32">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
<div class="flex items-center gap-3">
<button class="active:scale-95 duration-200 hover:bg-surface-container-high p-2 rounded-full transition-colors" style="">
<span class="material-symbols-outlined text-on-surface-variant" style="">arrow_back</span>
</button>
<h1 class="text-xl font-bold text-on-surface tracking-tight font-manrope" style="">Cadence</h1>
</div>
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant grayscale">
<img alt="User Profile" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0sTWtYdprSeahc_AePOpsbm-AMzTcK7-fvzazXLlYvJMsRQfqEPrA1jbeFJIoHt-6QYfMcvwWurOu--9kmbvX4DfhBHVEwx1CrNZ9uPs-clMBjBZ7dBtSAYBGxmlV0UWvfD_ifA1pyEKU3anibetXW4H-PP8E9x8qUITK9ft6hHX0r0OYVko8Y2MViDLiGYB9_O3UATT4Ug227xPFMTFUnRThbPaD0Loj1hRc6WiP4ySVvmLLNEzmppTy5fqW2r7RpokNKdVvhko" style="">
</div>
<button class="active:scale-95 duration-200 hover:bg-surface-container-high p-2 rounded-full transition-colors" style="">
<span class="material-symbols-outlined text-on-surface" style="">settings</span>
</button>
</div>
</header>
<main class="pt-24 px-6 max-w-5xl mx-auto">
<!-- Hero Section -->
<section class="mb-12 flex flex-col md:flex-row items-end justify-between gap-8">
<div class="w-full md:w-2/3">
<span class="text-on-surface-variant font-headline font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block" style="">Performance Insight</span>
<h2 class="text-5xl font-headline font-extrabold text-on-surface tracking-tighter leading-[1.1]" style="">Running <br>Rhythm</h2>
<p class="text-on-surface-variant mt-4 text-lg max-w-md font-body leading-relaxed" style="">
                Your evening sprints are becoming more consistent. We've detected a pattern in your elevation recovery.
            </p>
</div>
<div class="bg-surface-container-low border border-outline-variant/50 rounded-lg p-6 w-full md:w-1/3 flex flex-col justify-end min-h-[160px] relative overflow-hidden">
<div class="absolute top-0 right-0 p-8 opacity-5">
<span class="material-symbols-outlined text-8xl" style="font-variation-settings: &quot;FILL&quot; 1;">directions_run</span>
</div>
<div class="relative z-10">
<div class="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-1" style="">Consistency Score</div>
<div class="text-5xl font-headline font-black text-on-surface" style="">88%</div>
</div>
</div>
</section>
<!-- Bento Grid Insights -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
<!-- AI Insights -->
<div class="md:col-span-8 bg-surface-container border border-outline-variant/30 rounded-lg p-8 relative overflow-hidden">
<div class="flex items-center gap-3 mb-8">
<span class="material-symbols-outlined text-on-surface" style="">auto_awesome</span>
<h3 class="text-lg font-headline font-bold" style="">What we understood</h3>
</div>
<div class="space-y-8">
<div class="flex gap-6">
<div class="w-0.5 h-auto bg-on-surface/20 rounded-full"></div>
<p class="text-on-surface-variant text-lg font-body leading-relaxed" style="">
                        Your performance peaks between <span class="text-on-surface font-semibold" style="">18:00 and 19:30</span>. 
                        Choosing this window correlates with a 14% increase in VO2 Max efficiency.
                    </p>
</div>
<div class="flex gap-6">
<div class="w-0.5 h-auto bg-on-surface/20 rounded-full"></div>
<p class="text-on-surface-variant text-lg font-body leading-relaxed" style="">
                        Fatigue signals emerge after 42 minutes. We suggest a <span class="text-on-surface font-semibold" style="">3-minute active recovery</span> at the 35-minute mark.
                    </p>
</div>
</div>
</div>
<!-- Key Metrics Column -->
<div class="md:col-span-4 flex flex-col gap-6">
<div class="bg-surface-container-high rounded-lg p-6 flex flex-col justify-between flex-1">
<span class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest" style="">Longest Streak</span>
<div class="flex items-baseline gap-2 mt-2">
<span class="text-4xl font-headline font-black text-on-surface" style="">14</span>
<span class="text-on-surface-variant text-sm" style="">days</span>
</div>
<div class="mt-6 h-[2px] w-full bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-on-surface w-3/4"></div>
</div>
</div>
<div class="bg-surface-container-high rounded-lg p-6 flex flex-col justify-between flex-1">
<span class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest" style="">Avg. Intensity</span>
<div class="flex items-baseline gap-2 mt-2">
<span class="text-4xl font-headline font-black text-on-surface uppercase tracking-tighter" style="">High</span>
</div>
<div class="flex gap-1.5 mt-6">
<div class="h-1 w-full bg-on-surface rounded-full"></div>
<div class="h-1 w-full bg-on-surface rounded-full"></div>
<div class="h-1 w-full bg-on-surface rounded-full"></div>
<div class="h-1 w-full bg-surface-variant rounded-full"></div>
</div>
</div>
</div>
</div>
<!-- Habit Tracking View -->
<section class="bg-surface-container border border-outline-variant/30 rounded-lg p-8 mb-12">
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
<div>
<h3 class="text-lg font-headline font-bold mb-1" style="">Consistency Flux</h3>
<p class="text-on-surface-variant text-sm" style="">Visualizing your yearly commitment to movement.</p>
</div>
<div class="flex gap-2 text-[9px] font-label uppercase tracking-widest text-on-surface-variant items-center bg-black/40 px-3 py-1.5 rounded-full">
<span class="" style="">Less</span>
<div class="w-2.5 h-2.5 bg-surface-variant rounded-[1px]"></div>
<div class="w-2.5 h-2.5 bg-on-surface/20 rounded-[1px]"></div>
<div class="w-2.5 h-2.5 bg-on-surface/50 rounded-[1px]"></div>
<div class="w-2.5 h-2.5 bg-on-surface rounded-[1px]"></div>
<span class="" style="">More</span>
</div>
</div>
<div class="overflow-x-auto pb-4 scrollbar-hide">
<div class="min-w-[600px]">
<div class="contribution-grid">
<!-- Row 1 -->
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-surface-variant"></div>
<!-- Row 2 -->
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<!-- Row 3 -->
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-on-surface"></div>
<!-- Row 4 -->
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/20"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface"></div>
<div class="contribution-cell bg-on-surface/50"></div>
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-on-surface/20"></div>
</div>
</div>
</div>
<div class="mt-8 flex justify-between items-center pt-8 border-t border-outline-variant/20">
<div class="flex items-center gap-3">
<span class="text-4xl font-headline font-black text-on-surface" style="">184</span>
<span class="text-on-surface-variant text-[10px] font-label uppercase tracking-[0.2em]" style="">Total Sprints</span>
</div>
<button class="bg-surface-container-high border border-outline-variant hover:bg-surface-variant text-on-surface text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-all active:scale-95" style="">
                View History
            </button>
</div>
</section>
<!-- Contextual Recommendation Card -->
<section class="relative rounded-lg overflow-hidden h-[340px] flex items-center p-8 md:p-16 border border-outline-variant/30">
<img alt="Running path" class="absolute inset-0 w-full h-full object-cover grayscale opacity-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCch6zP4YKYTGtl2gAJgRN5sEqCfZNDfO_EN1B3ppvf-3A6QPFFngvYPtqb_UBnguzAOWbTkzgy31zGh4adk4ZJFxtW5hve9TWiTSCc0yxCogFhEokLYM-Z5qF9Oo_ytkEKk5ugQVGAHqL1WKzPC7UJxvE0hkWpb1bSwabiWDhLOrM409BLiseXJbUnZQ31UMau7SyZO5fFNanOFPghu4c6v-E-oW6ZuEgqCBlt2Z-AcDlO1PTRkUXkEoE4APFRnI-LO4n4ugcaGOU" style="">
<div class="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
<div class="relative z-10 max-w-lg">
<span class="text-on-surface-variant font-headline font-bold text-[10px] uppercase tracking-[0.3em] mb-3 block" style="">Next Evolution</span>
<h3 class="text-3xl font-headline font-extrabold mb-5 tracking-tight" style="">Interval Trining</h3>
<p class="text-on-surface-variant mb-8 font-body leading-relaxed text-sm" style="">Based on your recoery rate, alternating 2-minute sprints with 1-minute walks will increase your threshold by 12% in 3 weeks.</p>
<button class="bg-on-surface text-on-primary font-bold px-8 py-3.5 rounded-lg flex items-center gap-2 active:scale-95 transition-all text-sm uppercase tracking-widest" style="">
<span class="" style="">Genrate Rutine</span>
<span class="material-symbols-outlined text-sm" style="">bolt</span>
</button>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-black/95 backdrop-blur-3xl border-t border-outline-variant/30 z-50">
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-all active:scale-90 duration-200" href="#" style="">
<span class="material-symbols-outlined" style="">home</span>
<span class="font-inter text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5" style="">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface border-b-2 border-on-surface px-4 py-1.5 active:scale-90 duration-200" href="#" style="">
<span class="material-symbols-outlined" style="font-variation-settings: &quot;FILL&quot; 1;">analytics</span>
<span class="font-inter text-[9px] font-bold uppercase tracking-[0.2em] mt-1.5" style="">Insights</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-all active:scale-90 duration-200" href="#" style="">
<span class="material-symbols-outlined" style="">history</span>
<span class="font-inter text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5" style="">Log</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-all active:scale-90 duration-200" href="#" style="">
<span class="material-symbols-outlined" style="">tune</span>
<span class="font-inter text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5" style="">Settings</span>
</a>
</nav>
</body></html>

<!-- Widget (Minimal) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cadence Widget Concept</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-container": "#ffffff",
                    "surface-bright": "#f9f9f9",
                    "secondary": "#615e57",
                    "secondary-fixed-dim": "#afaba3",
                    "secondary-fixed": "#cbc6bd",
                    "on-tertiary": "#e2e2e2",
                    "surface-tint": "#5e5e5e",
                    "on-primary-container": "#ffffff",
                    "inverse-surface": "#2f3131",
                    "on-secondary": "#ffffff",
                    "on-error": "#ffffff",
                    "on-primary-fixed": "#ffffff",
                    "primary": "#000000",
                    "surface-variant": "#e2e2e2",
                    "error": "#ba1a1a",
                    "primary-container": "#3b3b3b",
                    "inverse-on-surface": "#f1f1f1",
                    "on-secondary-fixed": "#1d1c16",
                    "on-surface": "#1a1c1c",
                    "on-secondary-fixed-variant": "#3d3b35",
                    "on-secondary-container": "#1d1c16",
                    "surface": "#f9f9f9",
                    "surface-container-lowest": "#ffffff",
                    "on-background": "#1a1c1c",
                    "outline": "#777777",
                    "on-primary": "#e2e2e2",
                    "surface-container": "#eeeeee",
                    "error-container": "#ffdad6",
                    "tertiary-fixed": "#5d5f5f",
                    "on-tertiary-fixed-variant": "#e2e2e2",
                    "primary-fixed-dim": "#474747",
                    "primary-fixed": "#5e5e5e",
                    "tertiary-container": "#737575",
                    "surface-container-low": "#f3f3f3",
                    "surface-dim": "#dadada",
                    "background": "#f9f9f9",
                    "tertiary-fixed-dim": "#454747",
                    "secondary-container": "#d9d4cb",
                    "on-error-container": "#410002",
                    "on-primary-fixed-variant": "#e2e2e2",
                    "surface-container-highest": "#e2e2e2",
                    "on-surface-variant": "#474747",
                    "on-tertiary-fixed": "#ffffff",
                    "inverse-primary": "#c6c6c6",
                    "surface-container-high": "#e8e8e8",
                    "tertiary": "#3a3c3c"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #f9f9f9;
            font-family: 'Inter', sans-serif;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-on-surface min-h-screen flex flex-col">
<!-- TopAppBar -->
<header class="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-b border-[#e2e2e2] dark:border-[#333333] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-50">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest">
<img class="w-full h-full object-cover" data-alt="Minimalist black and white portrait of a person with clean studio lighting and neutral expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4q3mb1MrDs4c7nb16NNrTpN0YfCV_uTyo4dLacO2mLoaLf1X3n_BdrVEWhd-lVN0jJa98kqkJ7y5Yy8Jb9npPiGcbWwMU_-x3Kvj1fN60PcAJ5flNti5hcHKgNM0OqFYsbkdGoYHczcgCisb_U5_b2BlO64wToDQqvf_iMMfARkSAEPX_HEkUKW3mN7Gx95U9MlK8D775cHg-m0loOoZZ_kYFyfXtA7yfJm4lhVHgq2BnfM817Aeal9Sx7ewyVM3ePDlhtQnO7cQ"/>
</div>
<span class="font-manrope font-bold text-black dark:text-white text-lg">Cadence</span>
</div>
<div class="flex items-center gap-4">
<button class="text-[#5d5f5f] dark:text-[#a3a3a3] hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] p-2 transition-colors rounded-lg">
<span class="material-symbols-outlined">settings</span>
</button>
</div>
</header>
<main class="flex-grow p-6 md:p-12 space-y-16 max-w-4xl mx-auto w-full">
<!-- Focus Header -->
<header class="space-y-2 mb-12">
<span class="font-inter text-xs font-medium tracking-widest text-on-surface-variant uppercase">Design System</span>
<h1 class="font-manrope font-bold text-4xl md:text-5xl tracking-tight text-primary">Widget Concepts</h1>
<div class="h-1 w-12 bg-primary mt-4"></div>
</header>
<!-- Widget Section: Small -->
<section class="space-y-6">
<div class="flex items-center justify-between border-b border-outline-variant pb-2">
<h2 class="font-manrope font-semibold text-lg">Small Widget (2x2)</h2>
<span class="font-inter text-xs text-on-surface-variant">170 x 170 px</span>
</div>
<div class="flex flex-wrap gap-8">
<!-- Small Widget Instance -->
<div class="w-[170px] h-[170px] bg-surface-container-lowest border border-outline-variant rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group">
<div class="flex justify-between items-start w-full">
<span class="material-symbols-outlined text-primary text-2xl">album</span>
<span class="font-inter text-[10px] font-bold tracking-tighter text-on-surface-variant">CADENCE</span>
</div>
<div class="space-y-0">
<div class="font-manrope font-extrabold text-5xl tracking-tighter text-primary">72</div>
<div class="font-inter text-[11px] font-medium text-on-surface-variant uppercase tracking-widest">Rhythm Score</div>
</div>
<!-- Subtle background rhythm graphic (CSS only) -->
<div class="absolute bottom-0 right-0 left-0 h-1 bg-surface-container flex items-end">
<div class="w-1/3 h-full bg-primary opacity-20"></div>
<div class="w-1/4 h-full bg-primary opacity-40"></div>
<div class="w-1/2 h-full bg-primary"></div>
</div>
</div>
<div class="flex-1 min-w-[200px] flex flex-col justify-center">
<p class="text-sm text-on-surface-variant leading-relaxed italic">
                        The Small Widget focuses on a single, glanceable metric. High-contrast typography ensures the Rhythm Score is the primary anchor, while the minimalist record icon provides brand context.
                    </p>
</div>
</div>
</section>
<!-- Widget Section: Medium -->
<section class="space-y-6">
<div class="flex items-center justify-between border-b border-outline-variant pb-2">
<h2 class="font-manrope font-semibold text-lg">Medium Widget (4x2)</h2>
<span class="font-inter text-xs text-on-surface-variant">360 x 170 px</span>
</div>
<div class="flex flex-col gap-8">
<!-- Medium Widget Instance -->
<div class="w-full max-w-[360px] h-[170px] bg-surface-container-lowest border border-outline-variant rounded-[24px] flex overflow-hidden">
<!-- Left Column: Stats -->
<div class="w-2/5 p-6 flex flex-col justify-between border-r border-outline-variant bg-surface-container-low/30">
<span class="material-symbols-outlined text-primary">graphic_eq</span>
<div class="space-y-0">
<div class="font-manrope font-extrabold text-5xl tracking-tighter text-primary">72</div>
<div class="font-inter text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">Current Score</div>
</div>
</div>
<!-- Right Column: Actions -->
<div class="w-3/5 p-6 flex flex-col justify-between">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="relative flex h-2 w-2">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
<span class="font-inter text-[11px] font-bold tracking-tight uppercase">Listening</span>
</div>
<span class="font-inter text-[10px] text-on-surface-variant">14m left</span>
</div>
<div class="space-y-3">
<div class="space-y-1">
<div class="font-inter text-xs font-semibold truncate">Midnight City — M83</div>
<div class="w-full h-[2px] bg-surface-container rounded-full overflow-hidden">
<div class="bg-primary h-full w-[65%]"></div>
</div>
</div>
<button class="w-full h-10 bg-primary text-white rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-colors active:scale-95 duration-200">
<span class="material-symbols-outlined text-sm">add</span>
<span class="font-inter text-[12px] font-bold">Log Activity</span>
</button>
</div>
</div>
</div>
<div class="max-w-2xl">
<p class="text-sm text-on-surface-variant leading-relaxed">
                        The Medium Widget introduces interactivity and state. The left panel anchors the persistent identity (Rhythm Score), while the right panel handles dynamic content like the "Listening" status and primary "Log Activity" action.
                    </p>
</div>
</div>
</section>
<!-- Design Principles Grid -->
<section class="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="p-6 bg-surface-container-low rounded-xl space-y-3">
<span class="material-symbols-outlined text-primary">border_all</span>
<h3 class="font-manrope font-bold text-sm uppercase tracking-tight">Tonal Shifting</h3>
<p class="font-inter text-xs text-on-surface-variant leading-relaxed">No dropshadows. Elevation is achieved through shifts between #ffffff and #f3f3f3 backgrounds.</p>
</div>
<div class="p-6 bg-surface-container-low rounded-xl space-y-3">
<span class="material-symbols-outlined text-primary">text_fields</span>
<h3 class="font-manrope font-bold text-sm uppercase tracking-tight">Type Contrast</h3>
<p class="font-inter text-xs text-on-surface-variant leading-relaxed">Pairing heavy Manrope displays with light Inter functional labels to create an editorial feel.</p>
</div>
<div class="p-6 bg-surface-container-low rounded-xl space-y-3">
<span class="material-symbols-outlined text-primary">ink_eraser</span>
<h3 class="font-manrope font-bold text-sm uppercase tracking-tight">Zero Color</h3>
<p class="font-inter text-xs text-on-surface-variant leading-relaxed">A strict grayscale palette enforces a monastic focus on content and rhythm data.</p>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-t border-[#e2e2e2] dark:border-[#333333] fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4">
<a class="flex flex-col items-center justify-center text-black dark:text-white font-bold scale-95 duration-200" href="#">
<span class="material-symbols-outlined">home</span>
<span class="font-inter text-[10px] tracking-tight">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white" href="#">
<span class="material-symbols-outlined">history</span>
<span class="font-inter text-[10px] tracking-tight">History</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white" href="#">
<span class="material-symbols-outlined">mic</span>
<span class="font-inter text-[10px] tracking-tight">Log</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-inter text-[10px] tracking-tight">Settings</span>
</a>
</nav>
<!-- Content Spacer for Bottom Nav -->
<div class="h-24"></div>
</body></html>

<!-- Entry Detail (Minimal) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cadence - Entry Detail</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-tertiary-container": "#ffffff",
                        "surface-bright": "#f9f9f9",
                        "secondary": "#615e57",
                        "secondary-fixed-dim": "#afaba3",
                        "secondary-fixed": "#cbc6bd",
                        "on-tertiary": "#e2e2e2",
                        "surface-tint": "#5e5e5e",
                        "on-primary-container": "#ffffff",
                        "inverse-surface": "#2f3131",
                        "on-secondary": "#ffffff",
                        "on-error": "#ffffff",
                        "on-primary-fixed": "#ffffff",
                        "primary": "#000000",
                        "surface-variant": "#e2e2e2",
                        "error": "#ba1a1a",
                        "primary-container": "#3b3b3b",
                        "inverse-on-surface": "#f1f1f1",
                        "on-secondary-fixed": "#1d1c16",
                        "on-surface": "#1a1c1c",
                        "on-secondary-fixed-variant": "#3d3b35",
                        "on-secondary-container": "#1d1c16",
                        "surface": "#f9f9f9",
                        "surface-container-lowest": "#ffffff",
                        "on-background": "#1a1c1c",
                        "outline": "#777777",
                        "on-primary": "#e2e2e2",
                        "surface-container": "#eeeeee",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#5d5f5f",
                        "on-tertiary-fixed-variant": "#e2e2e2",
                        "primary-fixed-dim": "#474747",
                        "primary-fixed": "#5e5e5e",
                        "tertiary-container": "#737575",
                        "surface-container-low": "#f3f3f3",
                        "surface-dim": "#dadada",
                        "background": "#f9f9f9",
                        "tertiary-fixed-dim": "#454747",
                        "secondary-container": "#d9d4cb",
                        "on-error-container": "#410002",
                        "on-primary-fixed-variant": "#e2e2e2",
                        "outline-variant": "#c6c6c6",
                        "surface-container-highest": "#e2e2e2",
                        "on-surface-variant": "#474747",
                        "on-tertiary-fixed": "#ffffff",
                        "inverse-primary": "#c6c6c6",
                        "surface-container-high": "#e8e8e8",
                        "tertiary": "#3a3c3c"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "fontFamily": {
                        "headline": ["Manrope"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                }
            }
        }
    </script>
<style>
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .editorial-shadow {
            box-shadow: 0 12px 32px rgba(26, 28, 28, 0.06);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen">
<!-- TopAppBar -->
<header class="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-b border-[#e2e2e2] dark:border-[#333333] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-50">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="Minimalist user avatar profile silhouette against a clean white and gray geometric background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBor1ZI2tOEoLNO5Dl45IYWa-tO0jVbi9uoHOxYalcdBrnJMrjqY9rKB7avYDiPTDoE43nGsyy60bK-m6VQcysPqqWveJgvMaWN13Lpv0WZv_rXj9jN7MuMtpWwFTEzxwXeASRGnIZVN6zw8mSOKU-XGGuYfwWy6NKfsfV0Y2gMYzezTNuNC1M0-x9A82yk0xziZFCa_F9KEAAqI1Y549SoLik6kJ5iSKueWaS7Rtu7P1b8rxj8Grpx9J0QaqvcwAW2hhqNDiiIGss"/>
</div>
<span class="font-manrope font-bold text-black dark:text-white text-lg">Cadence</span>
</div>
<div class="flex items-center gap-6">
<nav class="hidden md:flex gap-8">
<a class="text-[#5d5f5f] dark:text-[#a3a3a3] font-inter text-xs hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] transition-colors p-2 rounded-lg" href="#">Home</a>
<a class="font-bold text-black dark:text-white font-inter text-xs opacity-80 p-2 rounded-lg" href="#">Log</a>
<a class="text-[#5d5f5f] dark:text-[#a3a3a3] font-inter text-xs hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] transition-colors p-2 rounded-lg" href="#">History</a>
</nav>
<button class="material-symbols-outlined text-black dark:text-white p-2 hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] rounded-full transition-colors">settings</button>
</div>
</header>
<main class="max-w-3xl mx-auto px-6 pt-12 pb-24">
<!-- Top Section: Time/Date -->
<section class="mb-12">
<span class="label-sm text-on-surface-variant font-medium tracking-widest uppercase mb-2 block">ENTRY RECORDED</span>
<h1 class="font-headline font-bold text-black dark:text-white text-5xl md:text-6xl tracking-tighter leading-tight">
                October 24, <br/>
<span class="text-on-surface-variant opacity-40">07:14 AM</span>
</h1>
</section>
<!-- Insight Bubble -->
<section class="mb-10">
<div class="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
<div class="absolute top-0 right-0 p-4 opacity-10">
<span class="material-symbols-outlined text-6xl" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
</div>
<h3 class="font-headline font-semibold text-lg mb-3">What we understood</h3>
<p class="font-body text-on-surface-variant leading-relaxed max-w-xl">
                    Cadence recognized a high-intensity session characterized by rhythmic breathing and consistent pace. Your vocal tone suggests a state of high physiological arousal and peak focus.
                </p>
</div>
</section>
<!-- Data Grid -->
<section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 editorial-shadow">
<span class="material-symbols-outlined text-on-surface-variant mb-3">sprint</span>
<p class="text-label-sm text-on-surface-variant font-medium uppercase mb-1">Activity</p>
<p class="font-headline font-bold text-xl">Morning Run</p>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 editorial-shadow">
<span class="material-symbols-outlined text-on-surface-variant mb-3">timer</span>
<p class="text-label-sm text-on-surface-variant font-medium uppercase mb-1">Duration</p>
<p class="font-headline font-bold text-xl">42 Minutes</p>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 editorial-shadow">
<span class="material-symbols-outlined text-on-surface-variant mb-3">mood</span>
<p class="text-label-sm text-on-surface-variant font-medium uppercase mb-1">Mood</p>
<p class="font-headline font-bold text-xl">Focused</p>
</div>
</section>
<!-- Original Entry Area -->
<section class="space-y-6">
<div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
<h2 class="font-headline font-semibold text-xl">Original Entry</h2>
<button class="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-primary-fixed transition-colors">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
<span class="text-xs font-semibold">Play Recording</span>
</button>
</div>
<div class="space-y-8 py-4">
<div class="relative pl-6 border-l-2 border-surface-container-highest">
<span class="absolute left-[-11px] top-0 w-5 h-5 bg-surface-container-highest rounded-full flex items-center justify-center text-[10px] font-bold">0:14</span>
<p class="font-body text-on-surface leading-relaxed text-lg italic">
                        "Just finishing up the third mile. Feeling a strong second wind. The air is crisp, visibility is high. Heart rate is holding steady around 165."
                    </p>
</div>
<div class="relative pl-6 border-l-2 border-surface-container-highest">
<span class="absolute left-[-11px] top-0 w-5 h-5 bg-surface-container-highest rounded-full flex items-center justify-center text-[10px] font-bold">1:42</span>
<p class="font-body text-on-surface leading-relaxed text-lg">
                        "Thinking about the quarterly review today. I want to emphasize the rhythmic nature of our development cycles. It feels like this run—sustainable but intense. Noted some soreness in my left calf, will need to stretch properly."
                    </p>
</div>
<div class="relative pl-6 border-l-2 border-surface-container-highest">
<span class="absolute left-[-11px] top-0 w-5 h-5 bg-surface-container-highest rounded-full flex items-center justify-center text-[10px] font-bold">3:05</span>
<p class="font-body text-on-surface leading-relaxed text-lg">
                        "Ending the session now. Total distance probably around 4.5 miles. Mood is elevated. Energy for the day is at 9/10. Logging this as a peak performance morning."
                    </p>
</div>
</div>
</section>
<!-- Tags / Metadata -->
<section class="mt-12 pt-8 border-t border-outline-variant/20 flex flex-wrap gap-2">
<span class="px-3 py-1 bg-surface-container rounded-full text-xs font-medium text-on-surface-variant">#fitness</span>
<span class="px-3 py-1 bg-surface-container rounded-full text-xs font-medium text-on-surface-variant">#mental-clarity</span>
<span class="px-3 py-1 bg-surface-container rounded-full text-xs font-medium text-on-surface-variant">#morning-routine</span>
</section>
</main>
<!-- BottomNavBar (Mobile Only) -->
<footer class="md:hidden fixed bottom-0 w-full z-50 bg-[#f9f9f9] dark:bg-[#1a1a1a] border-t border-[#e2e2e2] dark:border-[#333333] flex justify-around items-center h-20 pb-safe px-4">
<button class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white">
<span class="material-symbols-outlined">home</span>
<span class="font-inter text-[10px] tracking-tight">Home</span>
</button>
<button class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white">
<span class="material-symbols-outlined">history</span>
<span class="font-inter text-[10px] tracking-tight">History</span>
</button>
<button class="flex flex-col items-center justify-center text-black dark:text-white font-bold scale-95 duration-200">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">mic</span>
<span class="font-inter text-[10px] tracking-tight">Log</span>
</button>
<button class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white">
<span class="material-symbols-outlined">settings</span>
<span class="font-inter text-[10px] tracking-tight">Settings</span>
</button>
</footer>
</body></html>

<!-- Insights List (Minimal) -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cadence Insights - Obsidian Slate</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
            "tertiary": "#ffffff",
            "on-tertiary-fixed-variant": "#404040",
            "surface-variant": "#262626",
            "surface-tint": "#ffffff",
            "surface-container-high": "#1f1f1f",
            "on-secondary-fixed-variant": "#404040",
            "error": "#ffb4ab",
            "secondary-fixed": "#e5e5e5",
            "inverse-on-surface": "#000000",
            "on-tertiary-fixed": "#000000",
            "tertiary-fixed": "#f5f5f5",
            "surface-container-lowest": "#000000",
            "outline": "#737373",
            "error-container": "#93000a",
            "outline-variant": "#404040",
            "secondary-container": "#262626",
            "background": "#0a0a0a",
            "inverse-surface": "#ffffff",
            "primary-fixed-dim": "#a3a3a3",
            "on-surface": "#ffffff",
            "primary-container": "#404040",
            "on-error": "#690005",
            "primary-fixed": "#ffffff",
            "on-error-container": "#ffdad6",
            "surface-container-highest": "#262626",
            "tertiary-fixed-dim": "#a3a3a3",
            "secondary-fixed-dim": "#737373",
            "on-tertiary-container": "#ffffff",
            "tertiary-container": "#404040",
            "secondary": "#a3a3a3",
            "on-primary-container": "#ffffff",
            "on-secondary-fixed": "#000000",
            "inverse-primary": "#000000",
            "on-surface-variant": "#a3a3a3",
            "on-secondary-container": "#d4d4d4",
            "on-primary-fixed-variant": "#404040",
            "on-background": "#ffffff",
            "on-tertiary": "#000000",
            "on-secondary": "#000000",
            "on-primary-fixed": "#000000",
            "surface-dim": "#0a0a0a",
            "surface-bright": "#171717",
            "surface": "#0a0a0a",
            "primary": "#ffffff",
            "on-primary": "#000000",
            "surface-container-low": "#121212",
            "surface-container": "#171717"
          },
          "borderRadius": {
            "DEFAULT": "0.5rem",
            "lg": "1rem",
            "xl": "1.5rem",
            "full": "9999px"
          },
          "fontFamily": {
            "headline": ["Manrope"],
            "body": ["Inter"],
            "label": ["Inter"]
          }
        },
      },
    }
  </script>
<style>
    body {
      background-color: #0a0a0a;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    .glass-card {
      background: rgba(23, 23, 23, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
    }
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    .asymmetric-item {
      grid-column: span 2;
    }
    @media (min-width: 768px) {
      .bento-grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .asymmetric-item {
        grid-column: span 2;
        grid-row: span 2;
      }
    }
    .obsidian-border {
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
  </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="antialiased">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-white/5">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-white/10 grayscale">
<img alt="Profile" class="w-full h-full object-cover" data-alt="Close up portrait of a young man with a serene expression, soft cinematic studio lighting on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAikkpLT4oZLaCxzJreZeVGpz1hbYY9EAF9Ssm3_W88CuqUPjjUi8lZZpQrdmIy9WjHPduOgJt9ejvKAWvBK-Q_wMsdjo7Yj5xxVilFiSp2NgGVXFcJxqQOuvdG7fiQYItouH-N86r7m_lrgbLBaZ8LZ2d2juC6R-Ggr2RhO9eu7T_-bpUfvnpOeY_Tu0CgBER9bRlnBYkHUsGK29FLO6Exnv-C6IRAoZb5JnPAuOW2tvsZ0LNZfuCnDufZL0dsfFcVpu3l53p68l4"/>
</div>
<span class="text-xl font-bold text-white tracking-tight font-manrope">CADENCE</span>
</div>
<div class="flex items-center gap-2">
<button class="p-2 rounded hover:bg-white/5 transition-colors active:scale-95 duration-200 text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<button class="p-2 rounded hover:bg-white/5 transition-colors active:scale-95 duration-200 text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-5xl mx-auto">
<!-- Hero Insights Section -->
<section class="mb-12">
<h1 class="font-headline font-bold text-4xl tracking-tighter text-on-surface mb-2 uppercase">Insights</h1>
<p class="font-body text-base text-on-surface-variant max-w-xl leading-relaxed">Your rhythm is stabilizing. This week, your deep work sessions increased by <span class="text-white font-bold underline decoration-white/30 underline-offset-4">12%</span>.</p>
</section>
<!-- Bento Grid Content -->
<div class="bento-grid">
<!-- Feature Card: Asymmetric/Large -->
<div class="asymmetric-item obsidian-border p-8 rounded-lg flex flex-col justify-between min-h-[320px] relative overflow-hidden bg-surface-container-low">
<div class="absolute top-0 right-0 p-8 opacity-5">
<span class="material-symbols-outlined text-[120px]" data-icon="auto_graph">auto_graph</span>
</div>
<div>
<span class="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2 block">Consistency Index</span>
<h2 class="font-headline text-3xl font-bold text-on-surface">FLOW SCORE</h2>
</div>
<div class="flex items-end gap-2">
<span class="text-7xl font-headline font-black text-on-surface tracking-tighter">84</span>
<span class="text-white text-lg font-bold mb-3">/ 100</span>
</div>
<div class="w-full h-16 flex items-end gap-1.5">
<div class="flex-1 bg-white/5 h-[30%]"></div>
<div class="flex-1 bg-white/5 h-[45%]"></div>
<div class="flex-1 bg-white/5 h-[35%]"></div>
<div class="flex-1 bg-white/10 h-[60%]"></div>
<div class="flex-1 bg-white/20 h-[80%]"></div>
<div class="flex-1 bg-white h-[100%]"></div>
<div class="flex-1 bg-white/10 h-[50%]"></div>
</div>
</div>
<!-- Activity Card: Deep Work -->
<div class="bg-surface-container-low obsidian-border p-6 rounded-lg flex flex-col justify-between hover:bg-surface-container transition-colors cursor-pointer group">
<div class="flex justify-between items-start">
<div class="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white">
<span class="material-symbols-outlined" data-icon="psychology">psychology</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" data-icon="north_east">north_east</span>
</div>
<div>
<h3 class="font-headline text-lg font-bold text-on-surface mt-6 uppercase tracking-wider">Deep Work</h3>
<p class="font-label text-on-surface-variant text-xs mt-1">4.2 HRS AVG</p>
</div>
<div class="mt-4 flex gap-1 h-1.5 items-center">
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white/10"></div>
<div class="h-full flex-1 bg-white/10"></div>
</div>
</div>
<!-- Activity Card: Running -->
<div class="bg-surface-container-low obsidian-border p-6 rounded-lg flex flex-col justify-between hover:bg-surface-container transition-colors cursor-pointer group">
<div class="flex justify-between items-start">
<div class="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white">
<span class="material-symbols-outlined" data-icon="directions_run">directions_run</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" data-icon="north_east">north_east</span>
</div>
<div>
<h3 class="font-headline text-lg font-bold text-on-surface mt-6 uppercase tracking-wider">Running</h3>
<p class="font-label text-on-surface-variant text-xs mt-1">24.5 KM TOTAL</p>
</div>
<div class="mt-4 flex gap-1 h-1.5 items-center">
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white/10"></div>
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white"></div>
</div>
</div>
<!-- Activity Card: Yoga -->
<div class="bg-surface-container-low obsidian-border p-6 rounded-lg flex flex-col justify-between hover:bg-surface-container transition-colors cursor-pointer group">
<div class="flex justify-between items-start">
<div class="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white">
<span class="material-symbols-outlined" data-icon="self_improvement">self_improvement</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" data-icon="north_east">north_east</span>
</div>
<div>
<h3 class="font-headline text-lg font-bold text-on-surface mt-6 uppercase tracking-wider">Yoga</h3>
<p class="font-label text-on-surface-variant text-xs mt-1">3 SESSIONS</p>
</div>
<div class="mt-4 flex gap-1 h-1.5 items-center">
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white/10"></div>
</div>
</div>
<!-- Activity Card: Meditation -->
<div class="bg-surface-container-low obsidian-border p-6 rounded-lg flex flex-col justify-between hover:bg-surface-container transition-colors cursor-pointer group">
<div class="flex justify-between items-start">
<div class="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white">
<span class="material-symbols-outlined" data-icon="spa">spa</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" data-icon="north_east">north_east</span>
</div>
<div>
<h3 class="font-headline text-lg font-bold text-on-surface mt-6 uppercase tracking-wider">Mindful</h3>
<p class="font-label text-on-surface-variant text-xs mt-1">15 MIN DAILY</p>
</div>
<div class="mt-4 flex gap-1 h-1.5 items-center">
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white"></div>
<div class="h-full flex-1 bg-white"></div>
</div>
</div>
</div>
<!-- Secondary List Section -->
<section class="mt-16">
<div class="flex justify-between items-end mb-8">
<h2 class="font-headline text-xl font-bold text-on-surface uppercase tracking-widest">Recent Logs</h2>
<button class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all border-b border-transparent hover:border-white/30">History</button>
</div>
<div class="space-y-3">
<!-- Log Item -->
<div class="bg-surface-container-low obsidian-border p-5 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-surface-container transition-all">
<div class="flex items-center gap-5">
<div class="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 grayscale">
<img alt="Gym" class="w-full h-full object-cover" data-alt="Abstract cinematic overhead shot of weightlifting equipment in a moody, dimly lit gym with teal accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQELovRUEuHEVk0agI652DcE2HZQmDiBBfT2jV9iLwyi2rIddJHFAdJt0pyOhBaOPbfS5Mqw-FNkMsISSs5MMkwMbJ8P3G3Gwqn7uxsVHzzF_RWiWvKXIs9FQ1ib2ZkQXVmJh5UEByX23Uzfz2oIEZlyZK8Dn7SPkYiLwb0i23PxDcr0_y2Qua8n2msSeCRpNlcBZ_vsW6gSQjxEihr5tO5jtJ_ZlV__X2Df46qmB0NwwA-PZX8g7-gd-cNmUlSlqesVSxL_LOdzw"/>
</div>
<div>
<h4 class="font-headline text-base font-bold text-on-surface uppercase">Evening Strength</h4>
<p class="text-on-surface-variant text-xs mt-1 tracking-tight">Yesterday • 18:45</p>
</div>
</div>
<div class="text-right">
<p class="font-headline font-bold text-lg text-on-surface tracking-tighter">1h 12m</p>
<p class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">Vigorous</p>
</div>
</div>
<!-- Log Item -->
<div class="bg-surface-container-low obsidian-border p-5 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-surface-container transition-all">
<div class="flex items-center gap-5">
<div class="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 grayscale">
<img alt="Work" class="w-full h-full object-cover" data-alt="Minimalist workspace with a laptop and a cup of coffee on a dark wooden table, soft morning light from a window" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZAdmeFwHxnBxgTBy8TFMmvzMqT9GUjCUuDtBK6k739MZ0eYECNL7KsEagwWgFk757CSJAdkP0AUkLHUZgfrNXHEZwMZNqJUFiUcVSyHQaJO36hjn0AFvh1GoiMJIRYnk5CfF6QdNeU1rLRzmcH63y3ERQmUbGEDhBNh5VyaHW5Ut0POqtTeQ0wlzW0Az-GHBetZttUn2rWWegmRRMX4z9I-y3_PUnTVnCtVkuofXQc4F8DEy2xEZUPbUgvCaQwwuB4NscyszrBQ4"/>
</div>
<div>
<h4 class="font-headline text-base font-bold text-on-surface uppercase">Productivity Block</h4>
<p class="text-on-surface-variant text-xs mt-1 tracking-tight">Yesterday • 10:00</p>
</div>
</div>
<div class="text-right">
<p class="font-headline font-bold text-lg text-on-surface tracking-tighter">3h 30m</p>
<p class="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">Focused</p>
</div>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-white/5 z-50">
<button class="flex flex-col items-center justify-center text-on-surface-variant hover:text-white transition-all active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-inter text-[9px] font-semibold uppercase tracking-[0.2em] mt-1.5">Home</span>
</button>
<button class="flex flex-col items-center justify-center text-white active:scale-90 duration-200 relative">
<span class="material-symbols-outlined" data-icon="analytics" style="font-variation-settings: 'FILL' 1;">analytics</span>
<span class="font-inter text-[9px] font-semibold uppercase tracking-[0.2em] mt-1.5">Insights</span>
<div class="absolute -bottom-2 w-1 h-1 bg-white rounded-full"></div>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant hover:text-white transition-all active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-inter text-[9px] font-semibold uppercase tracking-[0.2em] mt-1.5">Log</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant hover:text-white transition-all active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="tune">tune</span>
<span class="font-inter text-[9px] font-semibold uppercase tracking-[0.2em] mt-1.5">Setup</span>
</button>
</nav>
</body></html>

<!-- Settings (Minimal) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cadence - Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Manrope:wght@600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-container": "#ffffff",
                    "surface-bright": "#f9f9f9",
                    "secondary": "#615e57",
                    "secondary-fixed-dim": "#afaba3",
                    "secondary-fixed": "#cbc6bd",
                    "on-tertiary": "#e2e2e2",
                    "surface-tint": "#5e5e5e",
                    "on-primary-container": "#ffffff",
                    "inverse-surface": "#2f3131",
                    "on-secondary": "#ffffff",
                    "on-error": "#ffffff",
                    "on-primary-fixed": "#ffffff",
                    "primary": "#000000",
                    "surface-variant": "#e2e2e2",
                    "error": "#ba1a1a",
                    "primary-container": "#3b3b3b",
                    "inverse-on-surface": "#f1f1f1",
                    "on-secondary-fixed": "#1d1c16",
                    "on-surface": "#1a1c1c",
                    "on-secondary-fixed-variant": "#3d3b35",
                    "on-secondary-container": "#1d1c16",
                    "surface": "#f9f9f9",
                    "surface-container-lowest": "#ffffff",
                    "on-background": "#1a1c1c",
                    "outline": "#777777",
                    "on-primary": "#e2e2e2",
                    "surface-container": "#eeeeee",
                    "error-container": "#ffdad6",
                    "tertiary-fixed": "#5d5f5f",
                    "on-tertiary-fixed-variant": "#e2e2e2",
                    "primary-fixed-dim": "#474747",
                    "primary-fixed": "#5e5e5e",
                    "tertiary-container": "#737575",
                    "surface-container-low": "#f3f3f3",
                    "surface-dim": "#dadada",
                    "background": "#f9f9f9",
                    "tertiary-fixed-dim": "#454747",
                    "secondary-container": "#d9d4cb",
                    "on-error-container": "#410002",
                    "on-primary-fixed-variant": "#e2e2e2",
                    "outline-variant": "#c6c6c6",
                    "surface-container-highest": "#e2e2e2",
                    "on-surface-variant": "#474747",
                    "on-tertiary-fixed": "#ffffff",
                    "inverse-primary": "#c6c6c6",
                    "surface-container-high": "#e8e8e8",
                    "tertiary": "#3a3c3c"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
        }
        body {
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .glass-nav {
            background: rgba(249, 249, 249, 0.8);
            backdrop-filter: blur(20px);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen flex flex-col">
<!-- TopAppBar -->
<header class="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-b border-[#e2e2e2] dark:border-[#333333] fixed top-0 w-full z-50 glass-nav">
<div class="flex justify-between items-center w-full px-6 h-16 max-w-2xl mx-auto">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant/20">
<img class="w-full h-full object-cover" data-alt="Minimalist grayscale user avatar profile photo with clean lighting and neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1gO69OQLpgXWhhIp3Ufd-cTrlTaNAq0xdH7qloqdG69Anbm_cUzMrS08PjIzw7MfKZW8fEXj6VwarXFPea7c2uLbp49w7n_TtPfaa5Oziu8_c-x4cSWTzCpkJJwSxqZyFX_Y_7SgasFo70XWE0xZUryI6XcOORgAMHWU5gfLSoFqc9K9SpM6UOdQeBZYnOqte2UPYPvoJKSzcDkE61YdAwfeEI6g8brnQ3m_KSPjvEoaspdb-DLOMnxWjvy1CyH4GIVMznoxbKaU"/>
</div>
</div>
<h1 class="font-manrope font-bold text-black dark:text-white text-lg tracking-tight">Cadence</h1>
<button class="text-[#5d5f5f] dark:text-[#a3a3a3] hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] transition-colors p-2 rounded-full">
<span class="material-symbols-outlined">settings</span>
</button>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full">
<!-- Focus Header -->
<header class="mb-10">
<h2 class="font-manrope font-bold text-4xl tracking-tight text-on-surface mb-2">Settings</h2>
<div class="inline-flex items-center px-3 py-1 bg-secondary-fixed-dim/20 rounded-full">
<span class="font-label text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant">Profile Preferences</span>
</div>
</header>
<!-- Profile Hero Section -->
<section class="mb-12 p-6 bg-surface-container-lowest rounded-xl flex items-center gap-5">
<div class="w-20 h-20 rounded-full bg-surface-container-highest flex-shrink-0 border border-outline-variant/20 overflow-hidden">
<img class="w-full h-full object-cover grayscale" data-alt="Close-up portrait of Alex Thompson, clean studio lighting, monochromatic high-end editorial style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWay82Mrm9wzOPE7MVgnhl9JsV-83pkJ3I1tlsIYCcl49pEvjk87K-27x3bqN0fT-uOh1Jn4zjdZUv0KECaxIIJwDtHc-GLW0cN6YH-z0CW99LA_CA0hsQGBM5grqO6e3wN6t13P_qGx-pRxH3OVssJYfxLqU2j244XC_fZeajPfgVoPlOrQx9axKd_MBQpu_Gf6aU9PgDJ0KEntSn55mBXPPql1HxsDxYe2hjpNB9WHcM6sJjwnF2LIx8RT-HMnwlyDnxBgkHnDY"/>
</div>
<div>
<h3 class="font-manrope font-bold text-xl text-on-surface">Alex Thompson</h3>
<p class="font-body text-sm text-on-surface-variant">Premium Member</p>
<div class="mt-2 text-xs font-medium text-primary bg-surface-container-highest inline-block px-2 py-0.5 rounded">Active Plan</div>
</div>
</section>
<!-- Settings Groups -->
<div class="space-y-10">
<!-- Account Group -->
<section>
<h4 class="font-label text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-4 px-1">Account</h4>
<div class="bg-surface-container-lowest rounded-xl overflow-hidden">
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
<span class="font-body text-sm text-on-surface">Email</span>
<div class="flex items-center gap-2">
<span class="font-body text-xs text-on-surface-variant">alex.t@example.com</span>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
<span class="font-body text-sm text-on-surface">Password</span>
<div class="flex items-center gap-2">
<span class="font-body text-xs text-on-surface-variant">••••••••</span>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</div>
</section>
<!-- App Preferences -->
<section>
<h4 class="font-label text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-4 px-1">App Preferences</h4>
<div class="bg-surface-container-lowest rounded-xl overflow-hidden">
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer">
<span class="font-body text-sm text-on-surface">Timezone</span>
<span class="font-body text-xs text-on-surface-variant">London, GMT+0</span>
</div>
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors">
<span class="font-body text-sm text-on-surface">Haptics</span>
<div class="w-10 h-5 bg-primary rounded-full relative flex items-center justify-end px-1">
<div class="w-3.5 h-3.5 bg-white rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors">
<span class="font-body text-sm text-on-surface">Notifications</span>
<div class="w-10 h-5 bg-surface-container-highest rounded-full relative flex items-center justify-start px-1">
<div class="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
</div>
</div>
</div>
</section>
<!-- Data & Privacy -->
<section>
<h4 class="font-label text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-4 px-1">Data &amp; Privacy</h4>
<div class="bg-surface-container-lowest rounded-xl overflow-hidden">
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
<span class="font-body text-sm text-on-surface">Export Data</span>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">download</span>
</div>
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
<span class="font-body text-sm text-on-surface">Privacy Policy</span>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">open_in_new</span>
</div>
</div>
</section>
<!-- Help & Support -->
<section>
<h4 class="font-label text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-4 px-1">Help &amp; Support</h4>
<div class="bg-surface-container-lowest rounded-xl overflow-hidden">
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
<span class="font-body text-sm text-on-surface">Support Center</span>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
<div class="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer group">
<span class="font-body text-sm text-on-surface">Feedback</span>
<span class="material-symbols-outlined text-outline-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
</div>
</div>
</section>
<!-- Logout Button -->
<div class="pt-6">
<button class="w-full bg-primary text-on-primary py-4 rounded-xl font-body font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all">
                    Sign Out
                </button>
<p class="text-center text-[10px] text-outline-variant font-medium tracking-tight mt-6 uppercase">Cadence Version 2.4.0</p>
</div>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-[#f9f9f9] dark:bg-[#1a1a1a] border-t border-[#e2e2e2] dark:border-[#333333]">
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined mb-1">home</span>
<span class="font-inter text-[10px] tracking-tight">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined mb-1">history</span>
<span class="font-inter text-[10px] tracking-tight">History</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined mb-1">mic</span>
<span class="font-inter text-[10px] tracking-tight">Log</span>
</a>
<a class="flex flex-col items-center justify-center text-black dark:text-white font-bold scale-95 transition-transform" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">settings</span>
<span class="font-inter text-[10px] tracking-tight">Settings</span>
</a>
</nav>
</body></html>

<!-- Home (Minimal) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cadence - The Intellectual Sanctuary</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-tertiary-container": "#ffffff",
                        "surface-bright": "#f9f9f9",
                        "secondary": "#615e57",
                        "secondary-fixed-dim": "#afaba3",
                        "secondary-fixed": "#cbc6bd",
                        "on-tertiary": "#e2e2e2",
                        "surface-tint": "#5e5e5e",
                        "on-primary-container": "#ffffff",
                        "inverse-surface": "#2f3131",
                        "on-secondary": "#ffffff",
                        "on-error": "#ffffff",
                        "on-primary-fixed": "#ffffff",
                        "primary": "#000000",
                        "surface-variant": "#e2e2e2",
                        "error": "#ba1a1a",
                        "primary-container": "#3b3b3b",
                        "inverse-on-surface": "#f1f1f1",
                        "on-secondary-fixed": "#1d1c16",
                        "on-surface": "#1a1c1c",
                        "on-secondary-fixed-variant": "#3d3b35",
                        "on-secondary-container": "#1d1c16",
                        "surface": "#f9f9f9",
                        "surface-container-lowest": "#ffffff",
                        "on-background": "#1a1c1c",
                        "outline": "#777777",
                        "on-primary": "#e2e2e2",
                        "surface-container": "#eeeeee",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#5d5f5f",
                        "on-tertiary-fixed-variant": "#e2e2e2",
                        "primary-fixed-dim": "#474747",
                        "primary-fixed": "#5e5e5e",
                        "tertiary-container": "#737575",
                        "surface-container-low": "#f3f3f3",
                        "surface-dim": "#dadada",
                        "background": "#f9f9f9",
                        "tertiary-fixed-dim": "#454747",
                        "secondary-container": "#d9d4cb",
                        "on-error-container": "#410002",
                        "on-primary-fixed-variant": "#e2e2e2",
                        "outline-variant": "#c6c6c6",
                        "surface-container-highest": "#e2e2e2",
                        "on-surface-variant": "#474747",
                        "on-tertiary-fixed": "#ffffff",
                        "inverse-primary": "#c6c6c6",
                        "surface-container-high": "#e8e8e8",
                        "tertiary": "#3a3c3c"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "fontFamily": {
                        "headline": ["Manrope"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .rhythm-ring {
            background: conic-gradient(from 0deg, #000000 72%, #e2e2e2 72%);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface font-body text-on-surface antialiased">
<!-- TopAppBar -->
<header class="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-b border-[#e2e2e2] dark:border-[#333333] flex justify-between items-center w-full px-6 h-16 fixed top-0 z-50">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="Minimalist professional portrait of a woman with soft lighting, grayscale aesthetic, clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1KdxZxN16TL2nWACe5Y7Ylm2mvrQuCoH1qbn0MmieTQdo_ANg2vcZwg_t5ldQT0_vSy3mUo3WeMjK-Zlw_aCa5oDqg0x1x_zjGTAAqFoeKeOmiwc4R4ODLYhf9QL5FRy6JT4SvfRqBYz6W3IbDU-LO72p9mB4EKbD8UWv4Gi3X6dPM5AEgaks5N_ESp0knOI8ULnC7MUVmlrxP09qtEAQ0Q5THGMfV3w1jFWZD_962KNMVFFxrwlHz_yKIVzCoEbcUXQR3kR9kk0"/>
</div>
</div>
<h1 class="font-headline font-bold text-black dark:text-white text-lg">Cadence</h1>
<button class="material-symbols-outlined text-[#000000] dark:text-[#ffffff] hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] transition-colors p-2 rounded-full">
            settings
        </button>
</header>
<main class="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-12">
<!-- Hero Section: Rhythm Score -->
<section class="flex flex-col items-center justify-center space-y-8 py-4">
<div class="relative flex items-center justify-center w-64 h-64">
<!-- Outer Progress Ring -->
<div class="absolute inset-0 rounded-full rhythm-ring opacity-10"></div>
<!-- Inner Score Content -->
<div class="z-10 flex flex-col items-center">
<span class="font-headline text-[5rem] font-bold tracking-tighter leading-none">72</span>
<span class="font-label text-on-surface-variant font-medium tracking-widest uppercase text-[10px] mt-2">Current Score</span>
</div>
<!-- Abstract Design Detail -->
<svg class="absolute inset-0 w-full h-full -rotate-90">
<circle class="opacity-100" cx="128" cy="128" fill="transparent" r="120" stroke="#000000" stroke-dasharray="753" stroke-dashoffset="210" stroke-width="2"></circle>
</svg>
</div>
<div class="text-center space-y-2">
<h2 class="font-headline text-2xl font-semibold tracking-tight">Today's Rhythm: Stable Flow</h2>
<p class="text-on-surface-variant max-w-xs mx-auto text-sm leading-relaxed">
                    A balanced morning with high activity. Consider more rest tonight.
                </p>
</div>
</section>
<!-- Recent Logs Section -->
<section class="space-y-4">
<div class="flex items-end justify-between px-1">
<h3 class="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">Recent Logs</h3>
<span class="font-label text-[10px] text-tertiary-fixed">View All</span>
</div>
<div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
<!-- Activity Chip 1 -->
<div class="flex-shrink-0 bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
<span class="material-symbols-outlined text-sm">fitness_center</span>
<span class="text-xs font-semibold">Lifting</span>
</div>
<!-- Activity Chip 2 -->
<div class="flex-shrink-0 bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
<span class="material-symbols-outlined text-sm">directions_run</span>
<span class="text-xs font-semibold">Running</span>
</div>
<!-- Activity Chip 3 -->
<div class="flex-shrink-0 bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
<span class="material-symbols-outlined text-sm">groups</span>
<span class="text-xs font-semibold">Meeting</span>
</div>
<!-- Activity Chip 4 -->
<div class="flex-shrink-0 bg-surface-container-lowest border border-outline-variant/20 rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer">
<span class="material-symbols-outlined text-sm">laptop_mac</span>
<span class="text-xs font-semibold">Deep Work</span>
</div>
</div>
</section>
<!-- Bento Insights (Custom Component for Monastic Style) -->
<section class="grid grid-cols-2 gap-4">
<div class="col-span-2 bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
<div class="flex justify-between items-start">
<div>
<p class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Peak Focus</p>
<p class="font-headline text-lg font-bold">10:30 AM — 12:45 PM</p>
</div>
<span class="material-symbols-outlined text-primary-fixed">bolt</span>
</div>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
<p class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Recovery</p>
<p class="font-headline text-xl font-bold">High</p>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
<p class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Strain</p>
<p class="font-headline text-xl font-bold">Medium</p>
</div>
</section>
</main>
<!-- Primary CTA: FAB -->
<div class="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
<button class="bg-primary text-on-primary w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90 ring-8 ring-surface">
<span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">mic</span>
</button>
</div>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-[#f9f9f9] dark:bg-[#1a1a1a] border-t border-[#e2e2e2] dark:border-[#333333]">
<!-- Home (Active) -->
<a class="flex flex-col items-center justify-center text-black dark:text-white font-bold scale-95 duration-200" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-inter text-[10px] tracking-tight">Home</span>
</a>
<!-- History -->
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">history</span>
<span class="font-inter text-[10px] tracking-tight">History</span>
</a>
<!-- Spacer for FAB center -->
<div class="w-12"></div>
<!-- Log -->
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">mic</span>
<span class="font-inter text-[10px] tracking-tight">Log</span>
</a>
<!-- Settings -->
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-inter text-[10px] tracking-tight">Settings</span>
</a>
</nav>
</body></html>

<!-- History (Minimal) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>History - Cadence</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-container": "#ffffff",
                    "surface-bright": "#f9f9f9",
                    "secondary": "#615e57",
                    "secondary-fixed-dim": "#afaba3",
                    "secondary-fixed": "#cbc6bd",
                    "on-tertiary": "#e2e2e2",
                    "surface-tint": "#5e5e5e",
                    "on-primary-container": "#ffffff",
                    "inverse-surface": "#2f3131",
                    "on-secondary": "#ffffff",
                    "on-error": "#ffffff",
                    "on-primary-fixed": "#ffffff",
                    "primary": "#000000",
                    "surface-variant": "#e2e2e2",
                    "error": "#ba1a1a",
                    "primary-container": "#3b3b3b",
                    "inverse-on-surface": "#f1f1f1",
                    "on-secondary-fixed": "#1d1c16",
                    "on-surface": "#1a1c1c",
                    "on-secondary-fixed-variant": "#3d3b35",
                    "on-secondary-container": "#1d1c16",
                    "surface": "#f9f9f9",
                    "surface-container-lowest": "#ffffff",
                    "on-background": "#1a1c1c",
                    "outline": "#777777",
                    "on-primary": "#e2e2e2",
                    "surface-container": "#eeeeee",
                    "error-container": "#ffdad6",
                    "tertiary-fixed": "#5d5f5f",
                    "on-tertiary-fixed-variant": "#e2e2e2",
                    "primary-fixed-dim": "#474747",
                    "primary-fixed": "#5e5e5e",
                    "tertiary-container": "#737575",
                    "surface-container-low": "#f3f3f3",
                    "surface-dim": "#dadada",
                    "background": "#f9f9f9",
                    "tertiary-fixed-dim": "#454747",
                    "secondary-container": "#d9d4cb",
                    "on-error-container": "#410002",
                    "on-primary-fixed-variant": "#e2e2e2",
                    "outline-variant": "#c6c6c6",
                    "surface-container-highest": "#e2e2e2",
                    "on-surface-variant": "#474747",
                    "on-tertiary-fixed": "#ffffff",
                    "inverse-primary": "#c6c6c6",
                    "surface-container-high": "#e8e8e8",
                    "tertiary": "#3a3c3c"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "fontFamily": {
                    "headline": ["Manrope"],
                    "body": ["Inter"],
                    "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
        }
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3 { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen">
<!-- TopAppBar -->
<header class="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-b border-[#e2e2e2] dark:border-[#333333] flex justify-between items-center w-full px-6 h-16 fixed top-0 z-50">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest">
<img class="w-full h-full object-cover" data-alt="Minimalist black and white user portrait with clean background and professional studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2w8F3J_NzOiUvz2jGM-57OHeWjvZBB_vQiGYIhT56561mCyyuEj57822xLsHN8iQ8mwBrEDbLeO_9j-k08lc7slaUSWi9pIZwcWzrxMEMV8hVGTcwswGI-m5rugw7JwWDI_WdQICu2FChVYNoa02IBLh_yQ2RzgP7MqovTSkPeOKajL6XGxyZb9hSUev9MpyIAKeDZUBbB_SxIH88iGls9ylotwOlVp8-ij_IVmgGITZBga6ZyK7ND2_rv5Tn1dA9a0NH_loJvcM"/>
</div>
</div>
<h1 class="font-manrope font-bold text-black dark:text-white text-lg">Cadence</h1>
<button class="material-symbols-outlined text-on-surface hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] transition-colors p-2 rounded-full">
            settings
        </button>
</header>
<main class="pt-24 pb-32 px-6 max-w-2xl mx-auto">
<!-- Focus Header -->
<div class="mb-10">
<div class="flex items-center justify-between mb-2">
<span class="font-label text-label-sm text-on-surface-variant uppercase tracking-widest">Archive</span>
<span class="px-2 py-0.5 bg-secondary-fixed-dim text-on-secondary-fixed text-[10px] font-bold rounded-sm uppercase tracking-tighter">Sync Active</span>
</div>
<h2 class="font-headline text-3xl font-bold tracking-tight text-on-surface">History</h2>
</div>
<!-- Search Bar -->
<div class="mb-8">
<div class="relative flex items-center group">
<span class="material-symbols-outlined absolute left-4 text-on-surface-variant">search</span>
<input class="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 text-body-md focus:ring-1 focus:ring-outline-variant/20 placeholder:text-on-surface-variant/50 transition-all" placeholder="Search transcripts..." type="text"/>
</div>
</div>
<!-- Time Filters -->
<div class="flex gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
<button class="px-5 py-2 bg-primary text-on-primary text-xs font-semibold rounded-full whitespace-nowrap">This Week</button>
<button class="px-5 py-2 bg-surface-container-highest text-on-surface text-xs font-medium rounded-full whitespace-nowrap hover:bg-surface-container-high transition-colors">This Month</button>
<button class="px-5 py-2 bg-surface-container-highest text-on-surface text-xs font-medium rounded-full whitespace-nowrap hover:bg-surface-container-high transition-colors">Activity</button>
<button class="px-5 py-2 bg-surface-container-highest text-on-surface text-xs font-medium rounded-full whitespace-nowrap hover:bg-surface-container-high transition-colors">Personal</button>
</div>
<!-- List View -->
<div class="space-y-6">
<div class="group">
<div class="flex justify-between items-baseline mb-4">
<span class="text-label-sm text-on-surface-variant font-medium">Monday, Oct 23</span>
<div class="h-[1px] flex-grow mx-4 bg-surface-container-highest"></div>
</div>
<div class="space-y-4">
<!-- Card 1 -->
<div class="bg-surface-container-lowest p-6 rounded-xl transition-all border border-transparent hover:border-outline-variant/20">
<div class="flex justify-between items-start mb-3">
<h3 class="font-headline text-lg font-semibold text-on-surface">Morning Run &amp; Coffee</h3>
<span class="text-label-sm text-on-surface-variant font-medium">08:14 AM</span>
</div>
<div class="flex gap-2 mb-4">
<span class="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded uppercase tracking-tighter">Activity</span>
<span class="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded uppercase tracking-tighter">High Energy</span>
</div>
<p class="text-body-md text-on-surface-variant leading-relaxed line-clamp-2">
                            Thinking about the architectural layering in the new project. The rhythm of the city feels different today, more structured but quiet...
                        </p>
</div>
<!-- Card 2 -->
<div class="bg-surface-container-lowest p-6 rounded-xl transition-all border border-transparent hover:border-outline-variant/20">
<div class="flex justify-between items-start mb-3">
<h3 class="font-headline text-lg font-semibold text-on-surface">Deep Work Reflection</h3>
<span class="text-label-sm text-on-surface-variant font-medium">02:45 PM</span>
</div>
<div class="flex gap-2 mb-4">
<span class="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded uppercase tracking-tighter">Productivity</span>
<span class="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded uppercase tracking-tighter">Focus</span>
</div>
<p class="text-body-md text-on-surface-variant leading-relaxed line-clamp-2">
                            Managed to clear the backlog of design tokens. The monochromatic system is holding up well under stress tests. Need to finalize...
                        </p>
</div>
</div>
</div>
<div class="group pt-4">
<div class="flex justify-between items-baseline mb-4">
<span class="text-label-sm text-on-surface-variant font-medium">Sunday, Oct 22</span>
<div class="h-[1px] flex-grow mx-4 bg-surface-container-highest"></div>
</div>
<div class="space-y-4">
<!-- Card 3 -->
<div class="bg-surface-container-lowest p-6 rounded-xl transition-all border border-transparent hover:border-outline-variant/20">
<div class="flex justify-between items-start mb-3">
<h3 class="font-headline text-lg font-semibold text-on-surface">Gallery Walkthrough</h3>
<span class="text-label-sm text-on-surface-variant font-medium">11:20 AM</span>
</div>
<div class="flex gap-2 mb-4">
<span class="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded uppercase tracking-tighter">Creative</span>
<span class="px-2 py-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded uppercase tracking-tighter">Inspiration</span>
</div>
<p class="text-body-md text-on-surface-variant leading-relaxed line-clamp-2">
                            The use of negative space in the sculpture wing was profound. It reminded me that what we leave out is just as important as...
                        </p>
</div>
</div>
</div>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-[#f9f9f9] dark:bg-[#1a1a1a] border-t border-[#e2e2e2] dark:border-[#333333]">
<button class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors">
<span class="material-symbols-outlined mb-1">home</span>
<span class="font-inter text-[10px] tracking-tight">Home</span>
</button>
<button class="flex flex-col items-center justify-center text-black dark:text-white font-bold scale-95 duration-200">
<span class="material-symbols-outlined mb-1">history</span>
<span class="font-inter text-[10px] tracking-tight">History</span>
</button>
<button class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors">
<div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary mb-1 -mt-6 shadow-xl">
<span class="material-symbols-outlined">mic</span>
</div>
<span class="font-inter text-[10px] tracking-tight">Log</span>
</button>
<button class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors">
<span class="material-symbols-outlined mb-1">settings</span>
<span class="font-inter text-[10px] tracking-tight">Settings</span>
</button>
</nav>
</body></html>

<!-- Log / Chat (Minimal) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cadence | Log</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Manrope:wght@600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                "on-tertiary-container": "#ffffff",
                "surface-bright": "#f9f9f9",
                "secondary": "#615e57",
                "secondary-fixed-dim": "#afaba3",
                "secondary-fixed": "#cbc6bd",
                "on-tertiary": "#e2e2e2",
                "surface-tint": "#5e5e5e",
                "on-primary-container": "#ffffff",
                "inverse-surface": "#2f3131",
                "on-secondary": "#ffffff",
                "on-error": "#ffffff",
                "on-primary-fixed": "#ffffff",
                "primary": "#000000",
                "surface-variant": "#e2e2e2",
                "error": "#ba1a1a",
                "primary-container": "#3b3b3b",
                "inverse-on-surface": "#f1f1f1",
                "on-secondary-fixed": "#1d1c16",
                "on-surface": "#1a1c1c",
                "on-secondary-fixed-variant": "#3d3b35",
                "on-secondary-container": "#1d1c16",
                "surface": "#f9f9f9",
                "surface-container-lowest": "#ffffff",
                "on-background": "#1a1c1c",
                "outline": "#777777",
                "on-primary": "#e2e2e2",
                "surface-container": "#eeeeee",
                "error-container": "#ffdad6",
                "tertiary-fixed": "#5d5f5f",
                "on-tertiary-fixed-variant": "#e2e2e2",
                "primary-fixed-dim": "#474747",
                "primary-fixed": "#5e5e5e",
                "tertiary-container": "#737575",
                "surface-container-low": "#f3f3f3",
                "surface-dim": "#dadada",
                "background": "#f9f9f9",
                "tertiary-fixed-dim": "#454747",
                "secondary-container": "#d9d4cb",
                "on-error-container": "#410002",
                "on-primary-fixed-variant": "#e2e2e2",
                "outline-variant": "#c6c6c6",
                "surface-container-highest": "#e2e2e2",
                "on-surface-variant": "#474747",
                "on-tertiary-fixed": "#ffffff",
                "inverse-primary": "#c6c6c6",
                "surface-container-high": "#e8e8e8",
                "tertiary": "#3a3c3c"
            },
            "borderRadius": {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
            },
            "fontFamily": {
                "headline": ["Manrope"],
                "body": ["Inter"],
                "label": ["Inter"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
        }
        .waveform-bar {
            width: 3px;
            background-color: #1a1c1c;
            border-radius: 2px;
        }
        ::-webkit-scrollbar { width: 0; background: transparent; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body selection:bg-surface-container-highest">
<!-- TopAppBar -->
<nav class="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-b border-[#e2e2e2] dark:border-[#333333] flex justify-between items-center w-full px-6 h-16 fixed top-0 z-50">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Minimalist professional portrait of a person in high-key lighting with neutral expression and clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl5_j6uMaanCxfQ-RmqjxeQuBhb9QkGDybPoA3Tch2ebPFeeMSZUj5pyKAOSrhM44W3jk5eO2Bjzij1gu50pMRybw6nZx95kIA3NMi5MHRePayTBU5cLeXvZX1O_Dhprk2qAAhjppVxCMs6_tgk1FBT3hvgMXavGxF_2EmyM0r4Y3yK3PlcWRRgDQDHzejBJ7hSIXKhOtU5ZMYyj86MsYzgzpNg0IqC7JkSyrgN4smZQoK9vXiiNjlIBMEuKNhvFL5Oye19weQiOE"/>
</div>
</div>
<h1 class="font-manrope font-bold text-black dark:text-white text-lg">Cadence</h1>
<div class="flex items-center justify-center p-2 rounded-full hover:bg-[#f3f3f3] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer">
<span class="material-symbols-outlined text-[#000000] dark:text-[#ffffff]">settings</span>
</div>
</nav>
<main class="pt-24 pb-32 px-6 max-w-xl mx-auto flex flex-col gap-10">
<!-- Waveform Visualization Section -->
<section class="flex flex-col items-center gap-4 py-8">
<div class="flex items-center justify-center gap-[4px] h-12">
<div class="waveform-bar h-4"></div>
<div class="waveform-bar h-8"></div>
<div class="waveform-bar h-12"></div>
<div class="waveform-bar h-6"></div>
<div class="waveform-bar h-10"></div>
<div class="waveform-bar h-7"></div>
<div class="waveform-bar h-9"></div>
<div class="waveform-bar h-11"></div>
<div class="waveform-bar h-4"></div>
<div class="waveform-bar h-8"></div>
</div>
<span class="font-label text-[10px] tracking-widest text-on-surface-variant font-medium">LISTENING...</span>
</section>
<!-- Chat Transcript -->
<section class="flex flex-col gap-8">
<!-- User Message -->
<div class="flex flex-col items-end gap-2 max-w-[85%] self-end">
<div class="bg-surface-container-highest px-5 py-4 rounded-xl rounded-tr-none">
<p class="text-on-surface text-[0.875rem] leading-relaxed">Spent an hour lifting, felt decent; went for a run in the morning.</p>
</div>
</div>
<!-- Assistant Message -->
<div class="flex flex-col items-start gap-2 max-w-[85%] self-start">
<div class="border border-outline-variant/30 px-5 py-4 rounded-xl rounded-tl-none bg-surface-container-lowest">
<p class="text-on-surface text-[0.875rem] leading-relaxed">How long was the run?</p>
</div>
</div>
<!-- Log Summary Card -->
<div class="w-full mt-4 flex flex-col gap-6">
<div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
<div class="flex items-center justify-between mb-8">
<span class="font-headline font-semibold text-lg tracking-tight">Entry Summary</span>
<div class="bg-secondary-fixed-dim/20 px-3 py-1 rounded-full">
<span class="text-[10px] font-semibold text-on-surface uppercase tracking-wider">Draft</span>
</div>
</div>
<!-- Grayscale Grid -->
<div class="grid grid-cols-2 gap-px bg-surface-container-highest overflow-hidden rounded-lg">
<div class="bg-surface-container-lowest p-4 flex flex-col gap-1">
<span class="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">Activity</span>
<span class="font-body text-sm font-semibold">Weightlifting + Running</span>
</div>
<div class="bg-surface-container-lowest p-4 flex flex-col gap-1 border-l border-surface-container-highest">
<span class="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">Duration</span>
<span class="font-body text-sm font-semibold">1h 45m Total</span>
</div>
<div class="bg-surface-container-lowest p-4 flex flex-col gap-1 border-t border-surface-container-highest">
<span class="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">Mood</span>
<span class="font-body text-sm font-semibold">Decent / Balanced</span>
</div>
<div class="bg-surface-container-lowest p-4 flex flex-col gap-1 border-l border-t border-surface-container-highest">
<span class="font-label text-[10px] text-on-surface-variant uppercase tracking-tighter">Time</span>
<span class="font-body text-sm font-semibold">07:30 AM</span>
</div>
</div>
</div>
<!-- Action Buttons -->
<div class="flex flex-col gap-3">
<button class="w-full bg-primary text-on-primary py-4 rounded-xl font-body font-bold text-sm tracking-wide transition-opacity active:opacity-80">
                        Confirm
                    </button>
<button class="w-full bg-transparent text-on-surface border border-outline-variant/40 py-4 rounded-xl font-body font-medium text-sm tracking-wide hover:bg-surface-container-low transition-colors">
                        Edit
                    </button>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<footer class="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-[#f9f9f9] dark:bg-[#1a1a1a] border-t border-[#e2e2e2] dark:border-[#333333]">
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined mb-1">home</span>
<span class="font-inter text-[10px] tracking-tight">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined mb-1">history</span>
<span class="font-inter text-[10px] tracking-tight">History</span>
</a>
<a class="flex flex-col items-center justify-center text-black dark:text-white font-bold scale-95 duration-200" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">mic</span>
<span class="font-inter text-[10px] tracking-tight">Log</span>
</a>
<a class="flex flex-col items-center justify-center text-[#5d5f5f] dark:text-[#a3a3a3] hover:text-black dark:hover:text-white transition-colors" href="#">
<span class="material-symbols-outlined mb-1">settings</span>
<span class="font-inter text-[10px] tracking-tight">Settings</span>
</a>
</footer>
</body></html>

<!-- Onboarding (Minimal) -->
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Cadence - Onboarding</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Manrope:wght@600;700;800&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-tertiary-container": "#ffffff",
                        "surface-bright": "#f9f9f9",
                        "secondary": "#615e57",
                        "secondary-fixed-dim": "#afaba3",
                        "secondary-fixed": "#cbc6bd",
                        "on-tertiary": "#e2e2e2",
                        "surface-tint": "#5e5e5e",
                        "on-primary-container": "#ffffff",
                        "inverse-surface": "#2f3131",
                        "on-secondary": "#ffffff",
                        "on-error": "#ffffff",
                        "on-primary-fixed": "#ffffff",
                        "primary": "#000000",
                        "surface-variant": "#e2e2e2",
                        "error": "#ba1a1a",
                        "primary-container": "#3b3b3b",
                        "inverse-on-surface": "#f1f1f1",
                        "on-secondary-fixed": "#1d1c16",
                        "on-surface": "#1a1c1c",
                        "on-secondary-fixed-variant": "#3d3b35",
                        "on-secondary-container": "#1d1c16",
                        "surface": "#f9f9f9",
                        "surface-container-lowest": "#ffffff",
                        "on-background": "#1a1c1c",
                        "outline": "#777777",
                        "on-primary": "#e2e2e2",
                        "surface-container": "#eeeeee",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#5d5f5f",
                        "on-tertiary-fixed-variant": "#e2e2e2",
                        "primary-fixed-dim": "#474747",
                        "primary-fixed": "#5e5e5e",
                        "tertiary-container": "#737575",
                        "surface-container-low": "#f3f3f3",
                        "surface-dim": "#dadada",
                        "background": "#f9f9f9",
                        "tertiary-fixed-dim": "#454747",
                        "secondary-container": "#d9d4cb",
                        "on-error-container": "#410002",
                        "on-primary-fixed-variant": "#e2e2e2",
                        "outline-variant": "#c6c6c6",
                        "surface-container-highest": "#e2e2e2",
                        "on-surface-variant": "#474747",
                        "on-tertiary-fixed": "#ffffff",
                        "inverse-primary": "#c6c6c6",
                        "surface-container-high": "#e8e8e8",
                        "tertiary": "#3a3c3c"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "fontFamily": {
                        "headline": ["Manrope"],
                        "body": ["Inter"],
                        "label": ["Inter"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f9f9f9;
        }
        .editorial-shadow {
            box-shadow: 0 12px 32px rgba(26, 28, 28, 0.06);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen flex flex-col items-center">
<!-- Main Content Canvas -->
<main class="max-w-md w-full min-h-screen px-8 pt-24 pb-12 flex flex-col justify-between">
<!-- Brand Identity Section -->
<div class="flex flex-col items-center text-center space-y-8">
<!-- Logo Icon -->
<div class="w-16 h-16 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container-lowest">
<span class="material-symbols-outlined text-primary text-4xl" data-icon="waves">waves</span>
</div>
<!-- Headline -->
<div class="space-y-4">
<h1 class="font-headline font-bold text-[2.5rem] leading-[1.1] tracking-tight text-primary">
                    Cadence: Speak your day.
                </h1>
<p class="font-body text-on-surface-variant text-base leading-relaxed px-4">
                    A calm, voice-first way to log activities and mood. Minimalist, focused, and secure.
                </p>
</div>
</div>
<!-- Feature Bento-ish Layout -->
<div class="mt-16 grid grid-cols-1 gap-4">
<div class="bg-surface-container-lowest p-5 rounded-xl flex items-start space-x-4 border border-outline-variant/10">
<div class="bg-surface-container-low p-2 rounded-lg">
<span class="material-symbols-outlined text-tertiary-fixed text-2xl" data-icon="bolt">bolt</span>
</div>
<div>
<h3 class="font-headline font-semibold text-primary text-sm">Fast parsing</h3>
<p class="font-body text-on-surface-variant text-xs mt-1">Instant transcription and intent detection from your voice notes.</p>
</div>
</div>
<div class="bg-surface-container-lowest p-5 rounded-xl flex items-start space-x-4 border border-outline-variant/10">
<div class="bg-surface-container-low p-2 rounded-lg">
<span class="material-symbols-outlined text-tertiary-fixed text-2xl" data-icon="mood">mood</span>
</div>
<div>
<h3 class="font-headline font-semibold text-primary text-sm">Mood tracking</h3>
<p class="font-body text-on-surface-variant text-xs mt-1">Sentiment analysis helps you understand your daily emotional rhythms.</p>
</div>
</div>
<div class="bg-surface-container-lowest p-5 rounded-xl flex items-start space-x-4 border border-outline-variant/10">
<div class="bg-surface-container-low p-2 rounded-lg">
<span class="material-symbols-outlined text-tertiary-fixed text-2xl" data-icon="analytics">analytics</span>
</div>
<div>
<h3 class="font-headline font-semibold text-primary text-sm">Structured insights</h3>
<p class="font-body text-on-surface-variant text-xs mt-1">Automatically categorize entries into actionable reports.</p>
</div>
</div>
</div>
<!-- Action Section -->
<div class="mt-auto pt-16 space-y-6 flex flex-col w-full">
<!-- Permissions Note -->
<div class="flex items-center justify-center space-x-2 px-6">
<span class="material-symbols-outlined text-[14px] text-tertiary-fixed" data-icon="mic">mic</span>
<p class="font-label text-on-surface-variant text-[10px] tracking-wide uppercase">
                    Microphone access is needed for recording.
                </p>
</div>
<div class="space-y-3 w-full">
<!-- Primary Button -->
<button class="w-full bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-base transition-opacity active:opacity-80 editorial-shadow">
                    Get Started
                </button>
<!-- Secondary Button -->
<button class="w-full bg-surface-container-highest text-on-surface py-4 rounded-xl font-headline font-semibold text-base transition-colors hover:bg-surface-container">
                    Sign In
                </button>
</div>
<!-- Footer Decorative Element -->
<div class="flex justify-center pt-4">
<div class="h-1 w-12 bg-surface-variant rounded-full"></div>
</div>
</div>
</main>
<!-- Visual Polish: Hero Image Placeholder (Asymmetric Background Element) -->
<div class="fixed top-0 right-0 -z-10 w-1/3 h-1/2 opacity-20 pointer-events-none">
<img alt="" class="w-full h-full object-cover grayscale" data-alt="Abstract minimalist waves pattern in soft gray and white tones representing sound frequencies and calm motion" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfGPI81CvYOTc7g5vdrFV6W0-sJ3rkdGTXCp9jKF9vJ5QEMloEBiwtVc6_LPNZJyKKeaAAYlZR39WB-BtHW09seDlGzBy_ImnHOvmF0PKyBYEWr6eIQIbvAnflT6UJxqCYcX29bO5IOO1BR5x_zdhWk0EPbeW7whXqY6NbIPBYDQLQFLsiYv5czi-e6iOCPBo6UxMVx9fcVXqrUb1S8ILbmmjn-_RJVvvl60JQ1DOhIiQkMngNhrrzBu1a8n0060Hs9KWg1RryX8s"/>
</div>
</body></html>