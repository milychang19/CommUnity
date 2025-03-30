import { db, collection, addDoc } from '../../lib/firebase'; // Import Firestore methods

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        gender,
        ageRange,
        raceEthnicity,
        citizenshipStatus,
        disabilities,
        issueType,
        issueDescription,
        province,
        city,
        impactLevel,
        improvementSuggestions,
        privacyAgreement,
        anonymousSubmission,
      } = req.body;

      // Create a new document in Firestore's "submissions" collection
      const docRef = await addDoc(collection(db, 'submissions'), {
        gender,
        ageRange,
        raceEthnicity,
        citizenshipStatus,
        disabilities,
        issueType,
        issueDescription,
        province,
        city,
        impactLevel,
        improvementSuggestions,
        privacyAgreement,
        anonymousSubmission,
        date: new Date(), // Store the current date for submission
      });

      // Return success response with the document ID
      res.status(200).json({ message: 'Submission successful', id: docRef.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to submit form data' });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
