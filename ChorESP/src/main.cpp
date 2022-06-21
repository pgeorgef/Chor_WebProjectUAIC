#include <esp_camera.h>
#define SSID_NAME ""
#define SSID_PASWORD ""
#include <Arduino.h>
#include <TinyGPSPlus.h>
#include <WifiLocation.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

// core heartRate
TaskHandle_t HeartTask;
void HeartTaskcode(void * pvParameters);

// gps settings
#define DEBUG_WIFI_LOCATION 1
const char* googleApiKey = "";
WifiLocation location(googleApiKey);

//heartrate sensor settings
MAX30105 particleSensor;
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred

float beatsPerMinute;
int beatAvg;
float temperature;
long irValue;
long delta;
#define I2C_SDA 14 // SDA Connected to GPIO 14
#define I2C_SCL 15 // SCL Connected to GPIO 15
TwoWire I2CSensors = TwoWire(0);

// camera settings
framesize_t FRAME_SIZE_IMAGE = FRAMESIZE_SVGA;
#define PIXFORMAT PIXFORMAT_JPEG;
int cameraImageExposure = 0;   // Camera exposure (0 - 1200)   If gain and exposure both set to zero then auto adjust is enabled
int cameraImageGain = 0;       // Image gain (0 - 30)
int cameraImageBrightness = 0; // Image brightness (-2 to +2)
const int SerialSpeed = 115200;
const char *ntpServer = "pool.ntp.org";
const char *TZ_INFO = "	EET-2EEST-3,M3.5.0/03:00:00,M10.5.0/04:00:00"; // (https://remotemonitoringsystems.ca/time-zone-abbreviations.php)
long unsigned lastNTPtime;
tm timeinfo;
time_t now;
// camera settings (for the standard - OV2640 - CAMERA_MODEL_AI_THINKER)
#define CAMERA_MODEL_AI_THINKER
#define PWDN_GPIO_NUM 32  // power to camera (on/off)
#define RESET_GPIO_NUM -1 // -1 = not used
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26 // i2c sda
#define SIOC_GPIO_NUM 27 // i2c scl
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25 // vsync_pin
#define HREF_GPIO_NUM 23  // href_pin
#define PCLK_GPIO_NUM 22  // pixel_clock_pin
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
WebServer server(80);
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include <string.h>


float latitude , longitude;
String  latitude_string , longitiude_string;
TinyGPSPlus gps;
std::string nmea;
byte gpsData;
void handleRoot();
void handleHeart();
bool getNTPtime(int sec);
void handleStream();
void handleLocation();
void sendHeader(WiFiClient &client, char* hTitle);
void sendFooter(WiFiClient &client);
bool initialiseCamera();
bool cameraImageSettings();
void setup()
{
  //Serial.begin(9600); // Start //Serial communication
  
  // //Serial.setDebugOutput(true);

  Serial.println("\n\n\n"); // line feeds
  Serial.println("-----------------------------------");
  Serial.println("-----------------------------------");
  Serial.begin(SerialSpeed);
  uint32_t frecv= 100000;
  I2CSensors.begin(I2C_SDA, I2C_SCL, frecv);
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // Turn-off the 'brownout detector'
  WiFi.begin(SSID_NAME, SSID_PASWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nWiFi connected, ");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  server.enableCORS(true);
  server.begin();
  server.on("/", handleRoot);
  server.on("/stream", handleStream);
  server.on("/location", handleLocation);
  server.on("/heart", handleHeart);
  // NTP - internet time
  Serial.println("\nGetting real time (NTP)");
  configTime(0, 0, ntpServer);
  setenv("TZ", TZ_INFO, 1);
  if (getNTPtime(10))
  { // wait up to 10 sec to sync
  }
  else
  {
    //Serial.println("Time not set");
  }
  lastNTPtime = time(&now);
  Serial.print(("\nInitialising camera: "));
  if (initialiseCamera())
  {
    Serial.println("OK");
  }
  else
  {
    Serial.println("failed");
  }
  Serial.println("\nStarted...");
  location_t loc = location.getGeoFromWiFi();

  Serial.println("Location request data");
  Serial.println(location.getSurroundingWiFiJson());
  Serial.println("Latitude: " + String(loc.lat, 7));
  Serial.println("Longitude: " + String(loc.lon, 7));
  Serial.println("Accuracy: " + String(loc.accuracy));
    if (!particleSensor.begin(I2CSensors)) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30102 was not found. Please check wiring/power. ");

  }
  else{
      particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED
  xTaskCreatePinnedToCore(
    HeartTaskcode,
    "Heart",
    10000,
    NULL,
    1,
    &HeartTask,
    0
  );
  }

}

void HeartTaskcode(void * pvParameters){
  Serial.print("heart task on core: ");
  Serial.println(xPortGetCoreID());
  while(1){
  irValue = particleSensor.getIR();
  


  if (checkForBeat(irValue) == true) {
    //We sensed a beat!
    delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }
  if( irValue > 50000 ){

  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);
  }
  if (irValue < 50000){
    Serial.print(" No finger?");
    delay(1000);
  }
  }
}

void loop()
{
  // put your main code here, to run repeatedly:
  
 //   while (//Serial2.available()) {
  //  //Serial.print(char(//Serial2.read()));
 // }


    server.handleClient();

 /*     latitude = gps.location.lat();
      latitude_string = String(latitude , 6);
      longitude = gps.location.lng();
      longitiude_string = String(longitude , 6);*/
      //Serial.print("Latitude = ");
      //Serial.println(latitude_string);
      //Serial.print("Longitude = ");
      //Serial.println(longitiude_string);
      
    
     //Serial.print("gpsData este: ");
     //Serial.println(gpsData);
     //Serial.println(gps.satellites.value());  

  }  


bool getNTPtime(int sec)
{

  uint32_t start = millis(); // timeout timer

  do
  {
    time(&now);
    localtime_r(&now, &timeinfo);
    //Serial.print(".");
    delay(100);
  } while (((millis() - start) <= (1000 * sec)) && (timeinfo.tm_year < (2016 - 1900)));

  if (timeinfo.tm_year <= (2016 - 1900))
    return false; // the NTP call was not successful
  {
    //Serial.print("now ");
    //Serial.println(now);
  }

  // Display time

  char time_output[30];
  strftime(time_output, 30, "%a  %d-%m-%y %T", localtime(&now));
  //Serial.println(time_output);
  //Serial.println();

  return true;
}

void sendFooter(WiFiClient &client)
{
  client.write("</body></html>\n");
  delay(3);
  client.stop();
}

void handleRoot()
{

  getNTPtime(2);                       // refresh current time from NTP server
  WiFiClient client = server.client(); // open link with client
  sendHeader(client, "Chor");
  client.write("<p> buna </p>");
  std::string s;
  s = "<p>" + nmea + std::string("</p>");
  client.write(s.c_str());
  sendFooter(client);
}

// ----------------------------------------------------------------
//      send standard html header (i.e. start of web page)
// ----------------------------------------------------------------
void sendHeader(WiFiClient &client, char *hTitle)
{
  // Start page
  client.write("HTTP/1.1 200 OK\r\n");
  client.write("Content-Type: text/html\r\n");
  client.write("Connection: close\r\n");
  client.write("\r\n");
  client.write("<!DOCTYPE HTML><html lang='en'>\n");
}

void handleLocation(){
  Serial.println("in handleLocation");
  location_t loc = location.getGeoFromWiFi();

  Serial.println("Location request data");
  Serial.println(location.getSurroundingWiFiJson());
  Serial.println("Latitude: " + String(loc.lat, 7));
  Serial.println("Longitude: " + String(loc.lon, 7));
  Serial.println("Accuracy: " + String(loc.accuracy));
  getNTPtime(2);                       // refresh current time from NTP server
  WiFiClient client = server.client(); // open link with client
   client.write("HTTP/1.1 200 OK\r\n");
  client.write("Access-Control-Allow-Origin: *\r\n");
  client.write("Access-Control-Max-Age: 10000\r\n");
  client.write("Access-Control-Allow-Methods: PUT,POST,GET,OPTIONS\r\n");
  client.write("Access-Control-Allow-Headers: *\r\n");
  client.write("Content-Type: application/json\r\n");
  client.write("\r\n");
  String latituteJson = "{\"latitude\":" + String("\"") + String(loc.lat, 7) + String("\",") ;
  String longitudeJson = "\"longitude\":" + String("\"") + String(loc.lon, 7) + String("\"}") ;

  client.write(latituteJson.c_str() ); 
  client.write(longitudeJson.c_str());
}

void handleHeart(){
  int status = 0;
  if(irValue < 50000 )
  status = 0;
  else
  status = 1;
  Serial.println("in handleheart");
  getNTPtime(2);                       // refresh current time from NTP server
  WiFiClient client = server.client(); // open link with client
   client.write("HTTP/1.1 200 OK\r\n");
  client.write("Access-Control-Allow-Origin: *\r\n");
  client.write("Access-Control-Max-Age: 10000\r\n");
  client.write("Access-Control-Allow-Methods: PUT,POST,GET,OPTIONS\r\n");
  client.write("Access-Control-Allow-Headers: *\r\n");
  client.write("Content-Type: application/json\r\n");
  client.write("\r\n");
  String statusS = "{\"status\":" + String("\"") + String(status) + String("\",") ;
  String beatAvgStr = "\"avgBPM\":" + String("\"") + String(beatAvg) + String("\"}") ;

  client.write(statusS.c_str() ); 
  client.write(beatAvgStr.c_str());
  

}

void handleStream()
{

  WiFiClient client = server.client(); // open link with client
  char buf[32];
  camera_fb_t *fb = NULL;

  // log page request including clients IP
  IPAddress cIP = client.remoteIP();
  //Serial.println("Live stream requested by " + cIP.toString());

  // html
  const char HEADER[] = "HTTP/1.1 200 OK\r\n"
                        "Access-Control-Allow-Origin: *\r\n"
                        "Content-Type: multipart/x-mixed-replace; boundary=123456789000000000000987654321\r\n";
  const char BOUNDARY[] = "\r\n--123456789000000000000987654321\r\n";     // marks end of each image frame
  const char CTNTTYPE[] = "Content-Type: image/jpeg\r\nContent-Length: "; // marks start of image data
  const int hdrLen = strlen(HEADER);                                      // length of the stored text, used when sending to web page
  const int bdrLen = strlen(BOUNDARY);
  const int cntLen = strlen(CTNTTYPE);
  client.write(HEADER, hdrLen);
  client.write(BOUNDARY, bdrLen);

  // send live jpg images until client disconnects
  while (true)
  {
    if (!client.connected())
      break;
    fb = esp_camera_fb_get(); // capture live image as jpg
    if (!fb)
    {
      //Serial.println("Error: failed to capture jpg image");
    }
    else
    {
      // send image
      client.write(CTNTTYPE, cntLen);         // send content type html (i.e. jpg image)
      sprintf(buf, "%d\r\n\r\n", fb->len);    // format the image's size as html and put in to 'buf'
      client.write(buf, strlen(buf));         // send result (image size)
      client.write((char *)fb->buf, fb->len); // send the image data
      client.write(BOUNDARY, bdrLen);         // send html boundary      see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
      esp_camera_fb_return(fb);               // return image buffer so memory can be released
    }
  }

  //Serial.println("Video stream stopped");
  delay(3);
  client.stop();
}

bool initialiseCamera()
{

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000;       // XCLK 20MHz or 10MHz for OV2640 double FPS (Experimental)
  config.pixel_format = PIXFORMAT;      // Options =  YUV422, GRAYSCALE, RGB565, JPEG, RGB888
  config.frame_size = FRAME_SIZE_IMAGE; // Image sizes: 160x120 (QQVGA), 128x160 (QQVGA2), 176x144 (QCIF), 240x176 (HQVGA), 320x240 (QVGA),
                                        //              400x296 (CIF), 640x480 (VGA, default), 800x600 (SVGA), 1024x768 (XGA), 1280x1024 (SXGA),
                                        //              1600x1200 (UXGA)
  config.jpeg_quality = 20;             // 0-63 lower number means higher quality (can cause failed image capture if set too low at higher resolutions)
  config.fb_count = 1;                  // if more than one, i2s runs in continuous mode. Use only with JPEG

  // check the esp32cam board has a psram chip installed (extra memory used for storing captured images)
  //    Note: if not using "AI thinker esp32 cam" in the Arduino IDE, SPIFFS must be enabled
  if (!psramFound())
  {
    //Serial.println("Warning: No PSRam found so defaulting to image size 'CIF'");
    config.frame_size = FRAMESIZE_CIF;
  }

  //#if defined(CAMERA_MODEL_ESP_EYE)
  //  pinMode(13, INPUT_PULLUP);
  //  pinMode(14, INPUT_PULLUP);
  //#endif

  esp_err_t camerr = esp_camera_init(&config); // initialise the camera
  if (camerr != ESP_OK)
  {
    //Serial.printf("ERROR: Camera init failed with error 0x%x", camerr);
  }

  cameraImageSettings(); // apply custom camera settings

  return (camerr == ESP_OK); // return boolean result of camera initialisation
}

bool cameraImageSettings()
{

  //Serial.println("Applying camera settings");

  sensor_t *s = esp_camera_sensor_get();
  if (s == NULL)
  {
    //Serial.println("Error: problem reading camera sensor settings");
    return 0;
  }

  // if both set to zero enable auto adjust
  s->set_vflip(s, 1); // flip camera
  if (cameraImageExposure == 0 && cameraImageGain == 0)
  {
    // enable auto adjust
    s->set_gain_ctrl(s, 1);                      // auto gain on
    s->set_exposure_ctrl(s, 1);                  // auto exposure on
    s->set_awb_gain(s, 1);                       // Auto White Balance enable (0 or 1)
    s->set_brightness(s, cameraImageBrightness); // (-2 to 2) - set brightness
  }
  else
  {
    // Apply manual settings
    s->set_gain_ctrl(s, 0);                      // auto gain off
    s->set_awb_gain(s, 1);                       // Auto White Balance enable (0 or 1)
    s->set_exposure_ctrl(s, 0);                  // auto exposure off
    s->set_brightness(s, cameraImageBrightness); // (-2 to 2) - set brightness
    s->set_agc_gain(s, cameraImageGain);         // set gain manually (0 - 30)
    s->set_aec_value(s, cameraImageExposure);    // set exposure manually  (0-1200)
  }

  return 1;
} //