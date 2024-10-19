import { Loader } from "lucide-react";

interface LoaderProps {
  style?: string;
  iconStyle?: string;
}
export const Loading = ({ style, iconStyle }: LoaderProps) => {
  return (
    <div className={`h-full flex items-center justify-center ${style}`}>
      <Loader
        className={`size-5 animate-spin text-muted-foreground ${iconStyle}`}
      />
    </div>
  );
};
