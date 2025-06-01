const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
  try {
    const application = state.applications.find(app => app.id === id);
    if (!application) {
      throw new Error('Application not found');
    }

    const updatedApplications = state.applications.map(app => 
      app.id === id ? { ...app, status, reviewedDate: new Date() } : app
    );
    
    // If application is approved, update the pet's status to adopted
    if (status === 'approved') {
      const updatedPets = state.pets.map(pet => 
        pet.id === application.petId ? { ...pet, status: 'adopted' } : pet
      );
      await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
      setState(prev => ({ ...prev, pets: updatedPets }));
    }
    
    await AsyncStorage.setItem('applications', JSON.stringify(updatedApplications));
    setState(prev => ({ ...prev, applications: updatedApplications }));
  } catch (err) {
    setError('Failed to update application');
    throw err;
  }
}; 