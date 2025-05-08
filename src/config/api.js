const BASE_URL = "https://screening.affycloudsolution.com/";

export const REGISTER = `${BASE_URL}candidates`;
export const GET_QUESTIONS = `${BASE_URL}questions`;
export const SUBMIT_AUDIO = `${BASE_URL}transcribe`;
export const SUBMIT_TEST = `${BASE_URL}assessments/submit`;
export const CANDIDATE_DETAILS = (candidateId) =>
  `${BASE_URL}candidates/${candidateId}`;
