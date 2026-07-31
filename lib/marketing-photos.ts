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
  {
    src: "/marketing/hero/athlete-25.jpg",
    alt: "High school football lineman lined up at night under the lights",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-26.jpg",
    alt: "High school football lineman stretching before a game on the field",
  },
  {
    src: "/marketing/hero/athlete-27.jpg",
    alt: "High school football quarterback holding the ball on the stadium stairs",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-28.jpg",
    alt: "High school girls lacrosse player sprinting downfield with the ball",
  },
  {
    src: "/marketing/hero/athlete-29.jpg",
    alt: "High school girls lacrosse player winding up to pass",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-30.jpg",
    alt: "High school girls lacrosse player standing on the field",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-31.jpg",
    alt: "High school track sprinter finishing a relay handoff",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-32.jpg",
    alt: "High school track sprinter holding the relay baton coming out of the blocks",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-33.jpg",
    alt: "High school football player standing on the field with his helmet off",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-34.jpg",
    alt: "High school football player smiling in a team photo holding a football",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-35.jpg",
    alt: "High school football player smiling on the track in his jersey",
    focus: "top",
  },
  {
    src: "/marketing/hero/athlete-36.jpg",
    alt: "High school football player tossing a football, studio portrait",
  },
  {
    src: "/marketing/hero/athlete-37.jpg",
    alt: "High school football player running with the ball on the field",
  },
];
