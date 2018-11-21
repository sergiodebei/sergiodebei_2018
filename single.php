<?php
/**
 * Template Name: Single
 * Description: Single
 * The template for displaying all single posts and attachments
 * @package Sergio De Bei
 */

$template               = 'single.twig';

$context                = Timber::get_context();
$post                   = Timber::query_post();
$context['post']        = $post;

// $context['post']->blocks = $post->get_field('blocks');
$context['body_class']  = 'page-single';

Timber::render( array( 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' ), $context );