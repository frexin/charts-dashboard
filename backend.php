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
            $chart_params = $_GET['params']['items'];
            $chart_params = json_encode($chart_params);
            $sql = 'INSERT INTO charts (dt_add, `name`, items) VALUES (:dt_add, :name, :items)';
            $stmt = $db->prepare($sql);
            $stmt->bindValue(':dt_add', time());
            $stmt->bindValue(':name', $_GET['params']['name']);
            $stmt->bindValue(':items', $chart_params);

            $stmt->execute();
            $result['group_id'] = $db->lastInsertId();
            break;
        case "collection.update":
            $chart_params = json_encode($_GET['params']['items']);

            $sql = 'UPDATE charts SET items = :items WHERE id = :id';

            $stmt = $db->prepare($sql);
            $stmt->bindValue(':id', $_GET['params']['id']);
            $stmt->bindValue(':items', $chart_params);
            $stmt->execute();
            break;
        case "collection.get":
            $id = $_GET['params']['id'];
            $stmt = $db->prepare('SELECT id, name, items FROM charts WHERE id = :id');
            $stmt->bindValue(':id', $id);
            $stmt->execute();
            $row = $stmt->fetch();
            $items = array_values(json_decode($row['items'], true));
            $row['items'] = [];
            foreach ($items as $item) {
                $row['items'][] = $item;
            }

            $result = $row;
            break;
    }

    header('Content-type: application/json');
    print json_encode($result);
}