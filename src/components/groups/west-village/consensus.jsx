export default function WestVillageStreetView() {
    return (
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 my-8">
        {/* image */}
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/components/groups/west-village/consensus_agents.png"
            alt="West Village Consensus Agents" 
            style={{ width: '100%', maxWidth: '650px', borderRadius: '12px', objectFit: 'cover' }}
          />  
        </div>
      </div>
    );
  }