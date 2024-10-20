export async function getImageBlob(url: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error(`Error fetching image: ${(error as any).messsage}`);
      throw error;
    }
  }