// melhorar quando for fazer o middleware validação
import { z } from 'zod';

const registerZodSchema = z.object({
  username: z.string().min(3, { message: 'username deve conter pelo menos 3 caracteres' }).max(20),
  password: z.string()
    .min(8, { message: 'A senha deve conter pelo menos 8 caracteres' })
    .max(20).regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' }),
}).required();

export default registerZodSchema;
