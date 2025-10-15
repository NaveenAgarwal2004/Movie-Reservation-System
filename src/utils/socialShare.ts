interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

export const shareOnSocial = {
  facebook: (data: ShareData) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  },

  twitter: (data: ShareData) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;
    window.open(url, '_blank', 'width=600,height=400');
  },

  whatsapp: (data: ShareData) => {
    const url = `https://wa.me/?text=${encodeURIComponent(data.text + ' ' + data.url)}`;
    window.open(url, '_blank', 'width=600,height=400');
  },

  telegram: (data: ShareData) => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  },

  email: (data: ShareData) => {
    const subject = encodeURIComponent(data.title);
    const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  },

  copyLink: async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, message: 'Link copied to clipboard!' };
    } catch (error) {
      return { success: false, message: 'Failed to copy link' };
    }
  },

  native: async (data: ShareData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
        });
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    } else {
      return { success: false, message: 'Web Share API not supported' };
    }
  },
};

export const generateShareText = {
  movie: (movieTitle: string) => `Just found this amazing movie on CineMax: ${movieTitle}! 🎬`,
  booking: (movieTitle: string) => `I just booked tickets for ${movieTitle} on CineMax! 🎟️🍿`,
  review: (movieTitle: string, rating: number) =>
    `Watched ${movieTitle} and rated it ${rating}/5 stars! Check it out on CineMax! ⭐`,
};
