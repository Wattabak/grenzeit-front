import "public/cesium/Widgets/widgets.css";
import MainContainer from "@/components/MainContainer";

export async function generateMetadata() {
  return {
    title: "Grenzeit",
    description: "Borders in time",
    authors: [{ name: "Vlad Tabakov", url: "https://github.com/Wattabak" }],
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainContainer>
        <div className="container mx-auto px-20">{children}</div>
      </MainContainer>
    </>
  );
}
