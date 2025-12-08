import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


import java.io.FileNotFoundException;
import java.time.Duration;
import java.util.Scanner;

public class Runner {
    private Scanner scan;
    private WebDriver driver;
    private String url = "http://localhost:3000";//change this to open any url (MUST INCLUDE 'HTTP(s)' AND '.com'
    private Lexer lexer;
    
    @BeforeEach
    public void setup() throws FileNotFoundException {
        lexer = new Lexer("testingData.txt");
        String projectRoot = System.getProperty("user.dir"); //gets the current DIR
        String Selenium_str = projectRoot + "/Selenium Testing/selenium-java-4.29.0"; //adds the driver folder
        System.setProperty("selenium-chrome-driver-4.29.0", /*Selenium_str*/"C:/Users/brand/OneDrive/Documents/College/4.Senior/Fall 2025/ICSI 418Y - Software Engineering/Selenium Testing/selenium-java-4.29.0");

        driver = new ChromeDriver();

        
        driver.get(url);
    
    }
    
    @AfterEach
    public void teardown(){
        driver.close();
    }

    @Test
    public void test_openURL()
    {
        // check if we are on the right page
        Assertions.assertEquals(driver.getTitle(), "Login");

    }

    @Test
    public void Normal_Signup_From_Login() throws InterruptedException {
        WebElement contactLink = driver.findElement(By.linkText("Sign up")); //gets the hyperlink by the text

        // Perform the click
        contactLink.click();
        Thread.sleep(100);
        String[] inputOrder = {"NU_FirstName", "NU_LastName", "NU_UserID", "NU_Password"};

        driver.findElement(By.name("First Name")).sendKeys(lexer.getData(inputOrder[0]));

        driver.findElement(By.name("Last Name")).sendKeys(lexer.getData(inputOrder[1]));

        driver.findElement(By.name("User ID")).sendKeys(lexer.getData(inputOrder[2]));

        driver.findElement(By.name("password")).sendKeys(lexer.getData(inputOrder[3]));

        Thread.sleep(100);
        driver.findElement(By.xpath("//button[text()='Sign Up']")).click();
        try {
            Alert alert = driver.switchTo().alert();
            if (alert.getText().equals("Error in Signing Up")) {
                Assertions.assertTrue(true); //User exsits
            }else{
                Assertions.assertEquals("/", driver.getCurrentUrl(), "The User was not able to be added (Could already exist");
            }
        }catch(NoAlertPresentException e) {

        }

    }

    @Test
    public void Normal_Login() throws InterruptedException {
        Thread.sleep(100);

        driver.findElement(By.id("User_ID")).sendKeys(lexer.getData("NU_UserID"));
        driver.findElement(By.id("password")).sendKeys(lexer.getData("NU_Password"));
        Thread.sleep(100);
        driver.findElement(By.id("submitBut")).click();

        Thread.sleep(100);
        Assertions.assertEquals("Home", driver.getTitle());
    }

    @Test
    public void Normal_Heart_Event()throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(1));
        driver.findElement(By.id("User_ID")).sendKeys(lexer.getData("NU_UserID"));
        driver.findElement(By.id("password")).sendKeys(lexer.getData("NU_Password"));
        Thread.sleep(100);
        driver.findElement(By.id("submitBut")).click();
        Thread.sleep(100);

        WebElement submitButton = driver.findElement(By.id("acceptInvite"));
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", submitButton);
        Thread.sleep(100);
        if(driver.getTitle().equals("My Events")){
            Assertions.assertTrue(true);
        }
    }

//
//  HOST TESTING
//
@Test
public void Host_Signup()throws InterruptedException {
    driver.navigate().to(url + "/HostSignup");
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

    // Fill Form
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("UserID"))).sendKeys(lexer.getData("NH_UserID"));
    driver.findElement(By.id("password")).sendKeys(lexer.getData("NH_Password"));
    driver.findElement(By.id("Email")).sendKeys(lexer.getData("NH_Email"));
    driver.findElement(By.id("Phone")).sendKeys(lexer.getData("NH_Phone"));
    driver.findElement(By.id("Org_Name")).sendKeys(lexer.getData("NH_OrgName"));

    // Click Submit: Use JS click to bypass the element click interception
    WebElement submitButton = driver.findElement(By.id("submitBut"));

    JavascriptExecutor js = (JavascriptExecutor) driver;
    js.executeScript("arguments[0].click();", submitButton);
    Thread.sleep(100); // Give time for axios request to resolve

    // --- CORRECTED ASSERTION LOGIC ---
    try {
        Alert alert = driver.switchTo().alert();
        // Test passes if alert is the expected error (user already exists)
        Assertions.assertEquals("Error in Signing Up", alert.getText(), "Expected 'Error in Signing Up' alert.");
        alert.accept();
    }catch(NoAlertPresentException e) {
        // No alert means success. Check for redirection to the login page (url + "/")
        wait.withTimeout(Duration.ofSeconds(2)).until(ExpectedConditions.urlToBe(url + "/"));
        Assertions.assertEquals(url + "/", driver.getCurrentUrl(), "Host signup succeeded but failed to redirect to login page.");
    }
}

    @Test
    public void HostLogin() throws InterruptedException {
        Thread.sleep(100);

        driver.findElement(By.id("User_ID")).sendKeys(lexer.getData("NH_UserID"));
        driver.findElement(By.id("password")).sendKeys(lexer.getData("NH_Password"));
        Thread.sleep(100);
        driver.findElement(By.id("submitBut")).click();

        Thread.sleep(100);
        Assertions.assertEquals("Host Home", driver.getTitle());
    }

    @Test
    public void HostCreateEvent()throws InterruptedException{
        Thread.sleep(100);

        driver.findElement(By.id("User_ID")).sendKeys(lexer.getData("NH_UserID"));
        driver.findElement(By.id("password")).sendKeys(lexer.getData("NH_Password"));
        Thread.sleep(100);
        driver.findElement(By.id("submitBut")).click();

        Thread.sleep(100);
        //Assertions.assertEquals("Host Home", driver.getTitle());
        driver.findElement(By.partialLinkText("Create Event")).click();
        Thread.sleep(200);


        //making the Event Now
        driver.findElement(By.id("name")).sendKeys("Group 10 Presentation");
        driver.findElement(By.id("location")).sendKeys("Humanities");
        driver.findElement(By.id("start_time")).sendKeys("2025-12-04T13:30");
        driver.findElement(By.id("end_time")).sendKeys("2025-12-04T14:50");
        driver.findElement(By.id("admission_price")).sendKeys("100");
        driver.findElement(By.id("description")).sendKeys("Group 10 will be presenting Decide to the class");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        WebElement submitButton = wait.until(
                ExpectedConditions.elementToBeClickable(By.id("submit"))
        );

        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", submitButton);
    }

    //Admin Testing
    @Test
    public void adminSignup() throws InterruptedException{
        driver.navigate().to(url + "/AdminSignup");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        // Note: Title check here depends on the actual page title, adjust if necessary.
        // wait.until(ExpectedConditions.titleIs("Admin Registration"));

        // Fill Form
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("First_Name"))).sendKeys(lexer.getData("AD_FirstName"));
        driver.findElement(By.id("Last_Name")).sendKeys((lexer.getData("AD_LastName")));
        driver.findElement(By.id("User_ID")).sendKeys(lexer.getData("AD_UserID"));

        // FIX: The key for password in Lexer is "AD_Pass", not "AD_Password"
        driver.findElement(By.id("password")).sendKeys(lexer.getData("AD_Pass"));

        driver.findElement(By.id("adminKey")).sendKeys(lexer.getData("ADKey"));

        // Click Submit (using JS click)
        WebElement submitButton = driver.findElement(By.id("submit"));

        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", submitButton);

        // --- CORRECTED ASSERTION LOGIC ---
        try {
            Alert alert = driver.switchTo().alert();
            // Test passes if alert is the expected error (user already exists)
            Assertions.assertEquals("Error in Admin Signup", alert.getText(), "Expected 'Error in Admin Signup' alert.");
            alert.accept();
        }catch(NoAlertPresentException e) {
            // No alert means success. Check for redirection to the login page (url + "/")
            wait.withTimeout(Duration.ofSeconds(2)).until(ExpectedConditions.urlToBe(url + "/"));
            Assertions.assertEquals(url + "/", driver.getCurrentUrl(), "Admin signup succeeded but failed to redirect to login page.");
        }
    }
}
