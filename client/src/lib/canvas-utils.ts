interface FormData {
  companyName: string;
  personName: string;
  profileImage: string | null;
}

export async function generateCallScreen(canvas: HTMLCanvasElement, formData: FormData): Promise<string> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Set canvas dimensions (landscape for banner display)
  canvas.width = 900;
  canvas.height = 200;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw call interface elements
  await drawCallInterface(ctx, canvas, formData);

  return canvas.toDataURL('image/png');
}

async function drawCallInterface(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, formData: FormData) {
  const bannerWidth = canvas.width - 20;
  const bannerHeight = canvas.height - 20;
  const bannerX = 10;
  const bannerY = 10;
  const bannerRadius = bannerHeight / 2;

  // Draw the pill-shaped black banner with shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, bannerRadius);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.restore();

  const padding = 30;

  // === LEFT SIDE: Profile Image and Text ===
  const profileSize = bannerHeight - 40;
  const profileRadius = profileSize / 2;
  const profileX = bannerX + padding + profileRadius;
  const profileY = bannerY + bannerHeight / 2;

  if (formData.profileImage) {
    await drawProfileImage(ctx, formData.profileImage, profileX, profileY, profileRadius);
  } else {
    ctx.beginPath();
    ctx.arc(profileX, profileY, profileRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#333333';
    ctx.fill();
    ctx.fillStyle = '#888888';
    ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', profileX, profileY);
  }

  // Text next to profile image
  const textX = profileX + profileRadius + 20;
  const textBaseY = profileY;

  ctx.fillStyle = '#AAAAAA';
  ctx.font = '30px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(formData.companyName, textX, textBaseY - 17);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  ctx.fillText(formData.personName, textX, textBaseY + 20);

  // === RIGHT SIDE: Buttons ===
  const buttonSize = bannerHeight - 60;
  const buttonSpacing = 15;
  const buttonY = bannerY + bannerHeight / 2;

  const acceptX = bannerX + bannerWidth - padding - buttonSize / 2;
  const declineX = acceptX - buttonSize - buttonSpacing;

  // Decline button (red)
  ctx.beginPath();
  ctx.arc(declineX, buttonY, buttonSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#FF3B30';
  ctx.fill();

  // Accept button (green)
  ctx.beginPath();
  ctx.arc(acceptX, buttonY, buttonSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#34C759';
  ctx.fill();

  // Draw icons inside buttons
  await drawButtonIcons(ctx, declineX, acceptX, buttonY, buttonSize);
}


async function drawProfileImage(
  ctx: CanvasRenderingContext2D, 
  imageSrc: string, 
  x: number, 
  y: number, 
  radius: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      
      // Calculate dimensions to fit image in circle
      const scale = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      ctx.drawImage(
        img, 
        x - scaledWidth / 2, 
        y - scaledHeight / 2, 
        scaledWidth, 
        scaledHeight
      );
      ctx.restore();
      resolve();
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

async function drawButtonIcons(
  ctx: CanvasRenderingContext2D,
  declineX: number,
  acceptX: number,
  buttonY: number,
  buttonSize: number
): Promise<void> {
  const iconSize = buttonSize * 0.6; // Make icons 60% of button size
  
  // Load and draw decline icon (drop.png)
  await new Promise<void>((resolve, reject) => {
    const dropImg = new Image();
    dropImg.crossOrigin = 'anonymous';
    dropImg.onload = () => {
      ctx.drawImage(
        dropImg,
        declineX - iconSize / 2,
        buttonY - iconSize / 2,
        iconSize,
        iconSize
      );
      resolve();
    };
    dropImg.onerror = reject;
    dropImg.src = import.meta.env.BASE_URL + 'assets/drop.png';
  });

  // Load and draw accept icon (pick.png)
  await new Promise<void>((resolve, reject) => {
    const pickImg = new Image();
    pickImg.crossOrigin = 'anonymous';
    pickImg.onload = () => {
      ctx.drawImage(
        pickImg,
        acceptX - iconSize / 2,
        buttonY - iconSize / 2,
        iconSize,
        iconSize
      );
      resolve();
    };
    pickImg.onerror = reject;
    pickImg.src = import.meta.env.BASE_URL + 'assets/pick.png';
  });
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function copyImageToClipboard(dataUrl: string): Promise<void> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    throw new Error('Clipboard API not supported or permission denied');
  }
}
