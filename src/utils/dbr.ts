import { BarcodeReader } from "dynamsoft-javascript-barcode";

/** LICENSE ALERT - README
 * To use the library, you need to first specify a license key using the API "license" as shown below.
 */

BarcodeReader.license = process.env.NEXT_PUBLIC_LICENSE || "";

/**
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=zip&product=dbr&package=js to get your own trial license good for 30 days.
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://www.dynamsoft.com/barcode-reader/programming/javascript/user-guide/?ver=9.6.32&utm_source=zip#specify-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END
 */

BarcodeReader.engineResourcePath =
  process.env.NEXT_PUBLIC_ENGINE_RESOURCE_PATH || "";
