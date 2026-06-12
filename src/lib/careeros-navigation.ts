import type { NavSection } from "./navigation";



export const CAREEROS_NAV: NavSection[] = [

  {

    id: "thewrker",

    title: "TheWrker",

    items: [

      {

        label: "Back to Workspace",

        href: "/",

        icon: "/assets/icons/workspace.svg",

      },

    ],

  },

  {

    id: "careeros",

    title: "CareerOS",

    items: [

      {

        label: "Dashboard",

        href: "/careeros",

        icon: "/assets/icons/workspace.svg",

      },

    ],

  },

  {

    id: "profile",

    title: "Profile",

    items: [

      {

        label: "Resume Lab",

        href: "/careeros/resume",

        icon: "/assets/icons/files.svg",

      },

      {

        label: "Cover Letter Studio",

        href: "/careeros/cover-letter",

        icon: "/assets/icons/text-editor.svg",

      },

    ],

  },

  {

    id: "discover",

    title: "Discover",

    items: [

      {

        label: "Job Search",

        href: "/careeros/opportunities",

        icon: "/assets/icons/converter.svg",

      },

      {

        label: "Scholarships",

        href: "/careeros/scholarships",

        icon: "/assets/icons/document.svg",

      },

      {

        label: "Bootcamps",

        href: "/careeros/bootcamps",

        icon: "/assets/icons/archive.svg",

      },

      {

        label: "Upskill Engine",

        href: "/careeros/upskill",

        icon: "/assets/icons/json.svg",

      },

    ],

  },

  {

    id: "track",

    title: "Track & Apply",

    items: [

      {

        label: "Application Tracker",

        href: "/careeros/applications",

        icon: "/assets/icons/document.svg",

      },

    ],

  },

  {

    id: "prepare",

    title: "Prepare",

    items: [

      {

        label: "Interview Prep",

        href: "/careeros/interview",

        icon: "/assets/icons/ai.svg",

      },

      {

        label: "Career Growth Agent",

        href: "/careeros/growth",

        icon: "/assets/icons/ai.svg",

      },

    ],

  },

  {

    id: "intelligence",

    title: "Intelligence",

    items: [

      {

        label: "Career Insights",

        href: "/careeros/insights",

        icon: "/assets/icons/json.svg",

      },

    ],

  },

];



export function getAllCareerOSNavItems() {

  return CAREEROS_NAV.flatMap((section) => section.items);

}



export function isCareerOSPath(pathname: string): boolean {

  return pathname === "/careeros" || pathname.startsWith("/careeros/");

}


