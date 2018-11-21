<?php
// Define imagesizes used by timmy
// https://github.com/mindkomm/timmy#sizes


add_filter( 'timmy/sizes', function( $sizes ) {
  return array(
    'slider' => array(
      'resize' => array( 1400, 586 ),
      'srcset' => array( 2 ),
      'name' => 'slider',
    ),
    'column' => array(
      'resize' => array( 437, 350 ),
      'srcset' => array( 2 ),
      'name' => 'column',
    ),
    'event' => array(
      'resize' => array( 130, 130 ),
      'srcset' => array( 2 ),
      'name' => 'event',
    ),
    // 'lightbox' => [
    //   'resize' => array( 900 ),
    //   'srcset' => array( 2 ),
    //   'name' => 'lightbox',
    // ],
    'lightbox-preview-hor' => [
      'resize' => array( 300, 225 ),
      'srcset' => array( 2 ),
      'name' => 'lightbox-preview-hor',
    ],
    'lightbox-preview-ver' => [
        'resize' => array( 225, 300 ),
        'srcset' => array( 2 ),
        'name' => 'lightbox-preview-ver',
      ]
  );
} );


// TODO
// 1400x586 slider
// 437x291 column image
// 130x130 event
// {{ image.image.id|get_timber_image_responsive('lightbox-preview-hor') }}