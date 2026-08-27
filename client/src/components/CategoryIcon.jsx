import React from "react";
import {
  Camera,
  Compass,
  Mic,
  Lightbulb,
  Laptop,
  Music,
  Video,
  Volume2,
  Wrench,
  Smartphone,
  Layers,
  Box,
  Plane,
  Package,
} from "lucide-react";

export default function CategoryIcon({ category, size = 20, className = "", style = {} }) {
  const iconProps = {
    size,
    className,
    style: { display: "inline-block", verticalAlign: "middle", ...style },
  };

  switch (category?.toLowerCase()) {
    case "camera":
      return <Camera {...iconProps} />;
    case "tripod":
      return <Compass {...iconProps} />;
    case "microphone":
    case "audio":
      return <Mic {...iconProps} />;
    case "lighting":
      return <Lightbulb {...iconProps} />;
    case "laptop":
      return <Laptop {...iconProps} />;
    case "instrument":
    case "music":
      return <Music {...iconProps} />;
    case "projector":
    case "display":
      return <Video {...iconProps} />;
    case "speaker":
    case "speakers":
      return <Volume2 {...iconProps} />;
    case "tool":
    case "tools":
      return <Wrench {...iconProps} />;
    case "smartphone":
    case "phone":
      return <Smartphone {...iconProps} />;
    case "drone":
      return <Plane {...iconProps} />;
    case "craft":
    case "textile":
      return <Layers {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
}
