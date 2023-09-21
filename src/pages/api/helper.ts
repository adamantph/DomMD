// Helper function to extract data based on a given regex pattern
const extractData = (response: string, pattern: RegExp): string[] => {
  const results: string[] = [];
  let match;

  while ((match = pattern.exec(response))) {
      const data = match[1]?.trim() || '';
      if (data) {
          results.push(data);
      }
  }

  return results;
};

// Helper function to extract possible diagnoses from the chatbot response
export const extractDiagnoses = (response: string): string[] => {
  const regex = /Possible diagnosis[s]?:\s*(.*?)\s*(?=Possible treatment[s]?|\n|$)/gs;
  return extractData(response, regex);
};

// Helper function to extract possible treatments from the chatbot response
export const extractTreatments = (response: string): string[] => {
  const regex = /Possible treatment[s]?:\s*(.*?)\s*(?=Recommended doctor[s]?|\n|$)/gs;
  return extractData(response, regex);
};

// Helper function to extract recommended doctors from the chatbot response
export const extractDoctors = (response: string): string[] => {
  const regex = /Recommended doctor[s]?:\s*(.*?)\s*(?=\n|$)/gs;
  return extractData(response, regex);
};
