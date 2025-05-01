export default function WestVillageStreetView() {
  return (
    <div className="relative w-90% h-90%">
      {/*ArcGIS Map */}
      <div className="">
        <iframe
          src="https://www.arcgis.com/apps/mapviewer/index.html?webmap=3d35ca6bff6243c19dd4e53f9d176b49"
          width="100%"
          height="100%"
          style={{ border: "1px solid #ccc", borderRadius: "12px" }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}