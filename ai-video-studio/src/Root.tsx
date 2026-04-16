import {Composition, Folder} from "remotion";
import {ShowcaseComposition} from "./compositions/Showcase";
import {TikTokVideo} from "./templates/social/TikTokVideo";
import {InstagramReel} from "./templates/social/InstagramReel";
import {YouTubeShort} from "./templates/social/YouTubeShort";
import {Presentation} from "./templates/content/Presentation";
import {Testimonial} from "./templates/content/Testimonial";
import {Announcement} from "./templates/promo/Announcement";
import {BeforeAfterDemo} from "./compositions/BeforeAfterDemo";
import {TalkingHeadEdit} from "./templates/editing/TalkingHeadEdit";
import {PodcastClip} from "./templates/editing/PodcastClip";
import {AutomatizacionIA} from "./compositions/AutomatizacionIA";
import {PodcastPromoClip} from "./compositions/PodcastPromoClip";
import {IULCuentaIndexada} from "./compositions/IUL-CuentaIndexada";
import {InsuranceAd} from "./templates/promo/InsuranceAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Examples">
        <Composition id="Showcase" component={ShowcaseComposition} durationInFrames={300} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="Social">
        <Composition id="TikTok" component={TikTokVideo} durationInFrames={270} fps={30} width={1080} height={1920} defaultProps={{hook: "Did you know this?", body: "AI can edit videos now using just code.", cta: "Follow for more"}} />
        <Composition id="InstagramReel" component={InstagramReel} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{headline: "Your headline", subtext: "Supporting text", brandName: "Brand"}} />
        <Composition id="YouTubeShort" component={YouTubeShort} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{title: "Your Title", subtitle: "Subtitle"}} />
      </Folder>
      <Folder name="Content">
        <Composition id="Presentation" component={Presentation} durationInFrames={450} fps={30} width={1920} height={1080} defaultProps={{slides: [{title: "Welcome", body: "Slide one"}, {title: "Problem", body: "What we solve"}, {title: "Solution", body: "How we solve it"}]}} />
        <Composition id="Testimonial" component={Testimonial} durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{quote: "Amazing product.", author: "Jane Doe", role: "CEO"}} />
      </Folder>
      <Folder name="Promo">
        <Composition id="Announcement" component={Announcement} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{preTitle: "Introducing", title: "Something Amazing", subtitle: "The future is here", cta: "Learn More"}} />
        <Composition id="BeforeAfter" component={BeforeAfterDemo} durationInFrames={180} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="Custom">
        <Composition id="AutomatizacionIA" component={AutomatizacionIA} durationInFrames={900} fps={30} width={1080} height={1920} />
        <Composition id="PodcastPromoClip" component={PodcastPromoClip} durationInFrames={1800} fps={30} width={1080} height={1080} defaultProps={{title: "El secreto para escalar tu agencia", speakerName: "Invitado", speakerTitle: "Experto en Seguros"}} />
      </Folder>
      <Folder name="Insurance">
        <Composition id="IUL-CuentaIndexada" component={IULCuentaIndexada} durationInFrames={750} fps={30} width={1080} height={1920} />
        <Composition id="InsuranceAd" component={InsuranceAd} durationInFrames={750} fps={30} width={1080} height={1920} defaultProps={{hook: "La industria de seguros crece un 8% cada a\u00f1o", productName: "Seguro de Vida", colorScheme: "dark" as const}} />
      </Folder>
      <Folder name="Editing">
        <Composition id="TalkingHeadEdit" component={TalkingHeadEdit} durationInFrames={900} fps={30} width={1920} height={1080} defaultProps={{videoSrc: "assets/video.mp4", showCaptions: true, captionPreset: "bold" as const, removeSilence: false}} />
        <Composition id="PodcastClip" component={PodcastClip} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={{videoSrc: "assets/video.mp4", clipStartSeconds: 0, clipEndSeconds: 30, showCaptions: true, captionPreset: "bold" as const}} />
      </Folder>
    </>
  );
};
