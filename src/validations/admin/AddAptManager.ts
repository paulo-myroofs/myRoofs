import { z } from "zod";

import addressData from "@/common/validation/addressData";
import email from "@/common/validation/email";
import userData from "@/common/validation/user";

export default z.object({
  ownerBasicInfo: userData,
  ownerAddressData: addressData,
  ownerEmail: email
});
