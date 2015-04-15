<?php
/**
 * Created by PhpStorm.
 * User: Admin
 * Date: 15.04.15
 * Time: 19:35
 */

$db = new PDO('sqlite:charts.sqlite3');

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    $result = [];

    switch ($action) {
        case "collection.names":
            $result['items'] = [];
            $rows = $db->query('SELECT id, name FROM charts');

            foreach ($rows as $row) {
                $result['items'][] = $row;
            }

            break;
        case "collection.save":
            $chart_params = $_GET['params']['items'][0];
            break;
    }

    header('Content-type: appliction/json');
    print json_encode($result);
}