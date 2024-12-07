
const filterTeamsByLeague = (allTeamsMaps: Record<string, any>, rarities: string[]) => {
    return Object.entries(allTeamsMaps).filter(([key, value]) => {
      const isIIHFSelected = rarities.includes("IIHF Awards");
      if (isIIHFSelected && rarities.length === 1) {
        return value.league === "IIHF";
      }
      if (isIIHFSelected && rarities.length > 1) {
        return true; 
      }
      return value.league !== "IIHF";
    });
  };

  export default filterTeamsByLeague