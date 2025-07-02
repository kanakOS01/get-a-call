interface FormData {
  companyName: string;
  personName: string;
  profileImage: string | null;
}

export async function generateCallScreen(canvas: HTMLCanvasElement, formData: FormData): Promise<string> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Set canvas dimensions (landscape for banner display)
  canvas.width = 1000;
  canvas.height = 200;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw call interface elements
  await drawCallInterface(ctx, canvas, formData);

  return canvas.toDataURL('image/png');
}

async function drawCallInterface(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, formData: FormData) {
  // Keep background transparent - no background fill
  
  // Draw the pill-shaped call banner (full width with margin)
  const bannerWidth = canvas.width - 20; // 980px with 10px margins
  const bannerHeight = canvas.height - 20; // 180px with 10px margins
  const bannerX = 10; // 10px margin from left
  const bannerY = 10; // 10px margin from top
  const bannerRadius = bannerHeight / 2;

  // Add shadow for the banner
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  // Draw pill-shaped banner background
  ctx.beginPath();
  ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, bannerRadius);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.restore(); // Remove shadow

  // Profile picture area (left side of banner)
  const profileSize = bannerHeight - 40; // Adjust to banner height with padding
  const profileX = bannerX + 30 + profileSize / 2;
  const profileY = bannerY + bannerHeight / 2;
  const profileRadius = profileSize / 2;

  if (formData.profileImage) {
    await drawProfileImage(ctx, formData.profileImage, profileX, profileY, profileRadius);
  } else {
    // Default profile circle
    ctx.beginPath();
    ctx.arc(profileX, profileY, profileRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#333333';
    ctx.fill();
    
    // Default person icon
    ctx.fillStyle = '#888888';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', profileX, profileY);
  }

  // Text area (next to profile picture)
  const textX = profileX + profileRadius + 20;
  const textBaseY = bannerY + bannerHeight / 2;

  // Company name (top line, smaller, gray)
  ctx.fillStyle = '#AAAAAA';
  ctx.font = '18px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(formData.companyName, textX, textBaseY - 12);

  // Person name (bottom line, larger, white, bold)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  ctx.fillText(formData.personName, textX, textBaseY + 15);

  // Action buttons (right side of banner)
  const buttonSize = bannerHeight - 60; // Smaller buttons for the reduced height
  const buttonSpacing = 15;
  const buttonsAreaX = bannerX + bannerWidth - 30 - (buttonSize * 2 + buttonSpacing);
  const buttonY = bannerY + bannerHeight / 2;

  // Decline button (red)
  const declineX = buttonsAreaX;
  ctx.beginPath();
  ctx.arc(declineX, buttonY, buttonSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#FF3B30';
  ctx.fill();

  // Decline icon - simple X symbol
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✕', declineX, buttonY);

  // Accept button (green)
  const acceptX = buttonsAreaX + buttonSize + buttonSpacing;
  ctx.beginPath();
  ctx.arc(acceptX, buttonY, buttonSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#34C759';
  ctx.fill();

  // Accept icon - simple checkmark symbol
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', acceptX, buttonY);
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
