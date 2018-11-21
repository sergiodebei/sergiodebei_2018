<?php
/**
 * The Template for displaying pages
 *
 */

$template               = 'home.twig';
$post                   = Timber::get_post();
$context                = Timber::get_context();
$context['post']        = $post;

$context['post']->blocks = $post->get_field('blocks');

$context['body_class']  = 'page-home';
$context['is_front_page'] = 'true';

$context['skills'] = get_field('skill');
$context['events'] = get_field('timeline_event');
$context['work'] = get_field('work');

// $context['projects']    = Timber::get_posts( 
//   [ 
//     'post_type'   => 'projects', 
//     'orderby'     => 'menu_order',
//     'order'       => 'ASC',
//     'numberposts' => '-1'
//   ]
// );

Timber::render([$template], $context);