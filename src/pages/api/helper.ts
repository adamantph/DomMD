// Helper function to extract possible diagnoses from the chatbot response
export const extractDiagnoses = (response: string): string[] => {
    const diagnoses: string[] = [];
    const regex = /Possible diagnosis[s]?:\s*(.*?)\s*(?=Possible treatment[s]?|\n|$)/gs;
    let match;
  
    while ((match = regex.exec(response))) {
      const diagnosis = match[1]?.trim() || '';
      if (diagnosis) {
        diagnoses.push(diagnosis);
      }
    }
  
    return diagnoses;
  };
  
  // Helper function to extract possible treatments from the chatbot response
  export const extractTreatments = (response: string): string[] => {
    const treatments: string[] = [];
    const regex = /Possible treatment[s]?:\s*(.*?)\s*(?=Recommended doctor[s]?|\n|$)/gs;
    let match;
  
    while ((match = regex.exec(response))) {
      const treatment = match[1]?.trim() || '';
      if (treatment) {
        treatments.push(treatment);
      }
    }
  
    return treatments;
  };
  
  // Helper function to extract recommended doctors from the chatbot response
  export const extractDoctors = (response: string): string[] => {
    const doctors: string[] = [];
    const regex = /Recommended doctor[s]?:\s*(.*?)\s*(?=\n|$)/gs;
    let match;
  
    while ((match = regex.exec(response))) {
      const doctor = match[1]?.trim() || '';
      if (doctor) {
        doctors.push(doctor);
      }
    }
  
    return doctors;
  };
  