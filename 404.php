<?php
/**
 * The template for displaying 404 pages (Not Found)
 */

$context = Timber::get_context();

$args = array(
    'post_type' => 'post',
    'posts_per_page' => 5,
);

$context['recentposts'] = Timber::get_posts( $args );

Timber::render( '404.twig', $context );