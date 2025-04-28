export default function WestVillageStreetView() {
    return (
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 my-8">
        {/* image */}
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/BIDspec/west_village/street_view1.png" 
            alt="West Village Street View" 
            style={{ width: '100%', maxWidth: '650px', borderRadius: '12px', objectFit: 'cover' }}
          />
        </div>
  
        {/*ArcGIS Map */}
        <div className="flex-1 flex justify-center items-center">
          <iframe
            src="https://www.arcgis.com/apps/mapviewer/index.html?webmap=3d35ca6bff6243c19dd4e53f9d176b49"
            width="100%"
            height="500"
            style={{ border: "1px solid #ccc", borderRadius: "12px" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    );
  }