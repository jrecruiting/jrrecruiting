export type MarketingPhoto = { src: string; alt: string; focus?: string };

// Parent-approved athlete photos for use across the marketing site (hero
// rotation, sign-up panel, etc). Add entries here as they're cleared for
// public marketing use; files live in public/marketing/hero/.
// `focus` sets the crop anchor (CSS object-position) for fixed-aspect-ratio
// panels — defaults to "center", but tall full-body shots need "top" so a
// vertical crop doesn't cut into the face.
export const ATHLETE_PHOTOS: MarketingPhoto[] = [
  {
    src: "/marketing/hero/athlete-01.jpg",
    alt: "High school football player on the sideline at dusk",
  },
  {
    src: "/marketing/hero/athlete-02.jpg",
    alt: "High school football lineman seated on the bench",
  },
  {
    src: "/marketing/hero/athlete-03.jpg",
    alt: "High school football quarterback throwing on the field",
  },
  {
    src: "/marketing/hero/athlete-04.jpg",
    alt: "High school football player adjusting his helmet on the sideline",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-05.jpg",
    alt: "High school football player in a team photo, number 15",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-06.jpg",
    alt: "High school football player smiling while stretching before a game",
  },
  {
    src: "/marketing/hero/athlete-07.jpg",
    alt: "High school football player smiling on the field after a game",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-08.jpg",
    alt: "High school football player with a teammate on the field",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-09.jpg",
    alt: "High school football player standing on the field holding his helmet",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-10.jpg",
    alt: "High school football player running onto the field",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-11.jpg",
    alt: "High school football lineman in game action",
  },
  {
    src: "/marketing/hero/athlete-12.jpg",
    alt: "High school football player walking off the field holding his helmet",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-13.jpg",
    alt: "High school football player looking downfield",
  },
  {
    src: "/marketing/hero/athlete-14.jpg",
    alt: "High school football player in a team photo with arms crossed",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-15.jpg",
    alt: "High school football player smiling in a team photo",
  },
  {
    src: "/marketing/hero/athlete-16.jpg",
    alt: "High school football player running toward the camera",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-17.jpg",
    alt: "High school football player kneeling on the field",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-18.jpg",
    alt: "High school football player looking up, close-up on the field",
  },
  {
    src: "/marketing/hero/athlete-19.jpg",
    alt: "High school football player in game gear, close-up portrait",
  },
  {
    src: "/marketing/hero/athlete-20.jpg",
    alt: "High school football player walking off the field holding his helmet",
  },
  {
    src: "/marketing/hero/athlete-21.jpg",
    alt: "High school football player with eye black, close-up after a game",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-22.jpg",
    alt: "High school football player in game action",
  },
  {
    src: "/marketing/hero/athlete-23.jpg",
    alt: "High school football player on the field with teammates",
  },
  {
    src: "/marketing/hero/athlete-24.jpg",
    alt: "High school football player in a team photo with arms crossed",
    focus: "top",
  },
];
