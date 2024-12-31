<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'conn.php'; // Connection to the database
include 'auth.php'; // Authentication check

// Fetch current settings from the database
$resultt = mysqli_query($con, "SELECT * FROM settings WHERE id='1'");
$roww = mysqli_fetch_array($resultt);
$edit = $roww['id'];

// Initialize variables for form values
$site_name = $roww['site_name'] ?? '';
$phone = $roww['phone'] ?? '';
$phone2 = $roww['phone2'] ?? '';
$email = $roww['email'] ?? '';
$address = $roww['address'] ?? '';
$facebook = $roww['facebook'] ?? '';
$twitter = $roww['twitter'] ?? '';
$linkedin = $roww['linkedin'] ?? '';
$instagram = $roww['instagram'] ?? '';
$youtube = $roww['youtube'] ?? '';
$map = $roww['map'] ?? '';
$moving_text_display = $roww['moving_text_display'] ?? 0;
$header_logo = $roww['header_logo'] ?? '';
$footer_logo = $roww['footer_logo'] ?? '';

// Handle form submission
if (isset($_POST['publise'])) {
    // Sanitize and collect form data
    $site_name = mysqli_real_escape_string($con, $_POST['site_name']);
    $phone = mysqli_real_escape_string($con, $_POST['phone']);
    $phone2 = mysqli_real_escape_string($con, $_POST['phone2']);
    $email = mysqli_real_escape_string($con, $_POST['email']);
    $address = mysqli_real_escape_string($con, $_POST['address']);
    $facebook = mysqli_real_escape_string($con, $_POST['facebook']);
    $twitter = mysqli_real_escape_string($con, $_POST['twitter']);
    $linkedin = mysqli_real_escape_string($con, $_POST['linkedin']);
    $instagram = mysqli_real_escape_string($con, $_POST['instagram']);
    $youtube = mysqli_real_escape_string($con, $_POST['youtube']);
    $map = mysqli_real_escape_string($con, $_POST['map']);
    $moving_text_display = isset($_POST['moving_text_display']) ? 1 : 0;

    // File upload handling for logos
    if (!empty($_FILES['header_logo']['name'])) {
        $header_logo = rand() . '_' . basename($_FILES['header_logo']['name']);
        $tempname = $_FILES['header_logo']['tmp_name'];
        $folder = "../images/logo/" . $header_logo;
        move_uploaded_file($tempname, $folder);
    }

    if (!empty($_FILES['footer_logo']['name'])) {
        $footer_logo = rand() . '_' . basename($_FILES['footer_logo']['name']);
        $tempname2 = $_FILES['footer_logo']['tmp_name'];
        $folder2 = "../images/logo/" . $footer_logo;
        move_uploaded_file($tempname2, $folder2);
    }

    // Update settings in the database
    $update_query = "UPDATE settings SET 
        site_name='$site_name', 
        phone='$phone', 
        phone2='$phone2', 
        email='$email', 
        address='$address', 
        header_logo='$header_logo', 
        footer_logo='$footer_logo', 
        facebook='$facebook', 
        twitter='$twitter', 
        linkedin='$linkedin', 
        instagram='$instagram', 
        youtube='$youtube', 
        map='$map', 
        moving_text_display='$moving_text_display' 
        WHERE id='$edit'";

    if (mysqli_query($con, $update_query)) {
        echo "<script>alert('Updated Successfully')<script>window.location.href = 'settings.php'</script>;</script>";
    } else {
        echo "<script>alert('Update Failed');</script>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <?php include "title.php"; ?>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="plugins/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <link rel="stylesheet" href="dist/css/adminlte.min.css">
    <link rel="stylesheet" href="plugins/summernote/summernote-bs4.css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
</head>

<body class="hold-transition sidebar-mini">
<div class="wrapper">
    <?php include "topbar.php"; ?>
    <?php include "sidebar.php"; ?>

    <div class="content-wrapper">
        <section class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <h1>Settings</h1>
                    </div>
                </div>
            </div>
        </section>

        <section class="content">
            <form action="" method="post" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card card-outline card-info">
                            <div class="card-body">
                                <!-- Site Information -->
                                <div class="form-group">
                                    <label>Site Name</label>
                                    <input name="site_name" value="<?php echo htmlspecialchars($site_name); ?>" type="text" class="form-control" placeholder="Enter Site Name">
                                </div>
                                <div class="form-group">
                                    <label>Phone</label>
                                    <input name="phone" value="<?php echo htmlspecialchars($phone); ?>" type="text" class="form-control" placeholder="Enter Phone Number">
                                </div>
                                <div class="form-group">
                                    <label>Phone 2</label>
                                    <input name="phone2" value="<?php echo htmlspecialchars($phone2); ?>" type="text" class="form-control" placeholder="Enter Second Phone Number">
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input name="email" value="<?php echo htmlspecialchars($email); ?>" type="text" class="form-control" placeholder="Enter Email">
                                </div>
                                <!-- Address Information -->
                                <div class="form-group">
                                    <label>Full Address</label>
                                    <input name="address" value="<?php echo htmlspecialchars($address); ?>" type="text" class="form-control" placeholder="Enter Full Address">
                                </div>
                                <!-- Social Media Links -->
                                <div class="form-group">
                                    <label>Facebook Link</label>
                                    <input name="facebook" value="<?php echo htmlspecialchars($facebook); ?>" type="text" class="form-control" placeholder="Enter Facebook URL">
                                </div>
                                <div class="form-group">
                                    <label>Twitter Link</label>
                                    <input name="twitter" value="<?php echo htmlspecialchars($twitter); ?>" type="text" class="form-control" placeholder="Enter Twitter URL">
                                </div>
                                <div class="form-group">
                                    <label>LinkedIn Link</label>
                                    <input name="linkedin" value="<?php echo htmlspecialchars($linkedin); ?>" type="text" class="form-control" placeholder="Enter LinkedIn URL">
                                </div>
                                <div class="form-group">
                                    <label>Instagram Link</label>
                                    <input name="instagram" value="<?php echo htmlspecialchars($instagram); ?>" type="text" class="form-control" placeholder="Enter Instagram URL">
                                </div>
                                <div class="form-group">
                                    <label>YouTube Link</label>
                                    <input name="youtube" value="<?php echo htmlspecialchars($youtube); ?>" type="text" class="form-control" placeholder="Enter YouTube URL">
                                </div>
                                <div class="form-group">
                                    <label>Map Embed Code</label>
                                    <textarea name="map" class="form-control" placeholder="Enter Map Embed Code"><?php echo htmlspecialchars($map); ?></textarea>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="moving_text_display" value="1" <?php echo $moving_text_display ? 'checked' : ''; ?>>
                                        <label class="form-check-label">Display Moving Text</label>
                                    </div>
                                </div>
                                <!-- Logo Uploads -->
                                <div class="form-group">
                                    <label>Header Logo</label>
                                    <input type="file" name="header_logo" class="form-control">
                                    <?php if (!empty($header_logo)) { ?>
                                        <img src="../images/logo/<?php echo $header_logo; ?>" alt="Header Logo" width="100">
                                    <?php } ?>
                                </div>
                                <div class="form-group">
                                    <label>Footer Logo</label>
                                    <input type="file" name="footer_logo" class="form-control">
                                    <?php if (!empty($footer_logo)) { ?>
                                        <img src="../images/logo/<?php echo $footer_logo; ?>" alt="Footer Logo" width="100">
                                    <?php } ?>
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="submit" name="publise" class="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    </div>

    <?php include "footer.php"; ?>
</div>

<script src="plugins/jquery/jquery.min.js"></script>
<script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="dist/js/adminlte.min.js"></script>
</body>
</html>
