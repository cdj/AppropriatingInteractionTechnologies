
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Carl Jamilkowski">

    <title>Carl's TV Viewing Voting</title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css">
  </head>

  <body>
    <div class="container">

<?php
  if(isset($_GET['vote']) && is_numeric($_GET['vote'])) {
    $con = mysqli_connect("localhost","cdj255","****","cdj255");
    // Check connection
    if (mysqli_connect_errno())
    {
      echo "Failed to connect to MySQL: ";// . mysqli_connect_error();
    }
    $result1 = mysqli_query($con,"SELECT * FROM `tv-polls` WHERE `votingSession`=" . $_GET['vote']);
?>
      <div class="page-header">
        <h1>Vote on what Carl watches next on TV.</h1>
<?php
      $ended = true;
      while($row = mysqli_fetch_array($result1))
      {
        echo '        <p class="lead">' . $row["prompt"] . '</p>
';
        $ended = $row["isEnded"];
      }
?>
      </div>
<?php
    if($ended) {
      echo "Sorry, this poll has ended. Please wait for a new poll to open!";
    } else {
      if(!isset($_POST['unwatchedShows']) || !is_numeric($_POST['unwatchedShows'])) {

        $result = mysqli_query($con,"SELECT `tv-shows`.showNum, `tv-shows`.showName FROM `tv-unwatched` INNER JOIN `tv-shows` ON `tv-unwatched`.showNum = `tv-shows`.showNum WHERE `votingSession`=" . $_GET['vote'] . " ORDER BY `tv-shows`.showName");
?>
      <h3>Carl's unwatched shows</h3>
      <p>
        <form role="form" method="post">
<?php
        while($row = mysqli_fetch_array($result))
        {
  echo '          <div class="radio"><label><input type="radio" name="unwatchedShows" value="' . $row["showNum"] . '">' . $row["showName"] . '</label></div>
  ';
        }
?>
          <button type="submit" class="btn btn-default">Watch this Show</button>
        </form>
      </p>
<?php
      } else {
        $ipAddr = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];

        $sql = "INSERT INTO `tv-votes` (votingSession, vote, `IP`) VALUES ($_GET[vote],'$_POST[unwatchedShows]','$ipAddr')";

        if (!mysqli_query($con, $sql))
        {
          die('Error');// die('Error: ' . mysqli_error($con));
        }
?>
      <div class="page-header">
        <h1>Vote on what Carl watches next on TV.</h1>
      </div>
      <p>Thanks for voting!</p>
<?php
      }
    }
    mysqli_close($con);
  } else {
?>
      <div class="page-header">
        <h1>Vote on what Carl watches next on TV.</h1>
      </div>
      <p>Please wait for a new poll to open!</p>
<?php
  }
?>
    </div> <!-- /container -->

    <script src="http://code.jquery.com/jquery.js"></script>
    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
  </body>
</html>